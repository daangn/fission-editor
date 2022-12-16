import * as React from "react";
import { useActor } from "@xstate/react";
import {
  useEditorDomRef,
  useEditorEvent,
  useEditorFocus,
  useEditorState,
} from "@remirror/react";

import { EditorManager } from "../context/EditorManager";
import { type Section } from "../hooks/useEditors";
import { useSectionDispatch } from "../hooks/useSectionDispatch";

type EditorInteractionsProps = {
  section: Section;
  match?: RegExpMatchArray;
};
const EditorInteractions: React.FC<EditorInteractionsProps> = ({
  section,
  match,
}) => {
  const headingRef = React.useRef<HTMLInputElement>(null);
  const editorState = useEditorState();
  const editorManagerRef = React.useContext(EditorManager);
  const [editorCurrent, sendParent] = useActor(editorManagerRef);
  const dispatch = useSectionDispatch(section.id);

  const ref = useEditorDomRef();

  const handleKeyDown = React.useCallback<React.KeyboardEventHandler>((e) => {
    if (e.code === "Backspace") {
      dispatch.inputBackspace();
    }
    if (e.code === "Enter") {
      dispatch.focusBody();
    }
  }, []);

  const handleFocusBody = React.useCallback(() => {
    dispatch.activate();
    dispatch.focusBody();
  }, []);

  React.useEffect(() => {
    dispatch.changeBody(editorState.doc.content.size - 2);
  }, [editorState]);

  React.useEffect(() => {
    const focusOnHeading = section.matches("focus.onHeading");
    if (focusOnHeading) {
      headingRef.current!.focus();
    }
    const focusOnBody = section.matches("focus.onBody");
    if (focusOnBody && !match) {
      focus();
    }
  }, [section, dispatch]);

  React.useEffect(() => {
    if (editorCurrent.event.type === "DESTROY_EDITOR") {
      focus();
    }
  }, [editorCurrent]);

  useEditorEvent("keydown", handleKeyDown as any);
  useEditorEvent("focus", handleFocusBody);

  return (
    <input
      type="input"
      ref={headingRef}
      data-level={section.getData().level}
      data-part="section-editor-heading"
      onChange={(e) => {
        dispatch.changeHeading(e.currentTarget.value);
      }}
      onKeyDown={handleKeyDown}
      onFocus={() => {
        dispatch.activate();
        dispatch.focusHeading();
      }}
    />
  );
};

export default EditorInteractions;

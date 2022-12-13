import * as React from "react";
import { useActor } from "@xstate/react";
import {
  useEditorEvent,
  useEditorFocus,
  useEditorState,
} from "@remirror/react";

import { type SectionEditorActorRef } from "../core/machines/sectionEditor.machine";

type EditorInteractionsProps = {
  sectionRef: SectionEditorActorRef;
};
const EditorInteractions: React.FC<EditorInteractionsProps> = ({
  sectionRef,
}) => {
  const headingRef = React.useRef<HTMLInputElement>(null);
  const editorState = useEditorState();

  const [current, send] = useActor(sectionRef);

  const [_isFocused, focus] = useEditorFocus();

  const handleKeyDown = React.useCallback<React.KeyboardEventHandler>((e) => {
    if (e.code === "Backspace") {
      send("INPUT_BACKSPACE");
    }
    if (e.code === "Enter") {
      send("FOCUS_BODY");
    }
  }, []);

  const handleFocusBody = React.useCallback(() => {
    send("ACTIVATE");
    send("FOCUS_BODY");
  }, []);

  React.useEffect(() => {
    send({
      type: "CHANGE_BODY",
      length: editorState.doc.content.size - 2,
    });
  }, [editorState]);

  React.useEffect(() => {
    const focusOnHeading = current.matches("focus.onHeading");
    if (focusOnHeading) {
      headingRef.current!.focus();
    }
    const focusOnBody = current.matches("focus.onBody");
    if (focusOnBody) {
      focus();
    }
  }, [current, send]);

  useEditorEvent("keydown", handleKeyDown as any);
  useEditorEvent("focus", handleFocusBody);

  return (
    <input
      type="input"
      ref={headingRef}
      data-level={current.context.level}
      data-part="section-editor-heading"
      onChange={(e) => {
        send({
          type: "CHANGE_HEADING",
          length: e.currentTarget.value.length,
        });
      }}
      onKeyDown={handleKeyDown}
      onFocus={() => {
        send("ACTIVATE");
        send("FOCUS_HEADING");
      }}
    />
  );
};

export default EditorInteractions;

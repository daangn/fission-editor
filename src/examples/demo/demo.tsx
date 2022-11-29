import * as React from "react";
import { useMachine, useActor } from "@xstate/react";
import { htmlToProsemirrorNode, type EditorState } from "remirror";
import { MarkdownExtension } from "remirror/extensions";

import {
  Remirror,
  useRemirror,
  useEditorEvent,
  useEditorFocus,
  useEditorState,
  useRemirrorContext,
} from "@remirror/react";
import { HeadingExtension } from "./heading-extension";
import {
  editorManagerMachine,
  type EditorManagerEventSender,
} from "../../machines/editorManager.machine";
import { type SectionEditorActorRef } from "../../machines/sectionEditor.machine";
import { Sender } from "xstate";

export default function Demo() {
  const [current, send] = useMachine(editorManagerMachine, {
    devTools: true,
    context: {
      editors: [],
      currentEditorId: null,
    },
  });

  React.useEffect(() => {
    const editorId = current.context.currentEditorId;
    if (editorId) {
      send({ type: "FOCUS_EDITOR", id: editorId });
    }
  }, [current.context.currentEditorId]);

  return (
    <div
      tabIndex={0}
      style={{
        width: "100vw",
        minHeight: "200px",
        border: "1px solid",
        display: "flex",
        flexDirection: "column",
        gap: "50px",
      }}
      onFocus={() => {
        send("ACTIVATE");
      }}
      onBlur={() => {
        send("DEACTIVATE");
      }}
    >
      {current.context.editors.map(([id, ref]) => (
        // <DemoInput key={id} id={id} editorRef={ref} />
        <Editor key={id} id={id} editorRef={ref} sendParent={send} />
      ))}
    </div>
  );
}

type EditorProps = {
  id: string;
  sendParent: EditorManagerEventSender;
  editorRef: SectionEditorActorRef;
  // level: 1 | 2 | 3 | 4 | 5 | 6;
  // initialState?: EditorState,
};

type EditorHandle = {
  getBodyState(): EditorState;
};

const Editor = React.forwardRef<EditorHandle, EditorProps>(
  ({ id, sendParent, editorRef }: EditorProps, forwardedRef) => {
    const emitter = (_match: RegExpMatchArray) => {
      sendParent("SPAWN_EDITOR");
    };
    const { manager, state } = useRemirror({
      extensions: () => [new HeadingExtension(emitter)],
      stringHandler: htmlToProsemirrorNode,
    });

    React.useImperativeHandle(forwardedRef, () => ({
      getBodyState() {
        return state;
      },
    }));

    return (
      <div style={{ border: "1px solid" }}>
        <Remirror key={id} manager={manager} autoRender="end">
          <EditorInteractions editorRef={editorRef} />
        </Remirror>
      </div>
    );
  }
);

type EditorInteractionsProps = {
  editorRef: SectionEditorActorRef;
};

function EditorInteractions({ editorRef }: EditorInteractionsProps) {
  const headingRef = React.useRef<HTMLInputElement>(null);
  const editorState = useEditorState();

  const [current, send] = useActor(editorRef);

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
}

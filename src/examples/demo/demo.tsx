import * as React from "react";
import { useMachine, useActor } from "@xstate/react";
import { htmlToProsemirrorNode, type EditorState } from "remirror";
import { MarkdownExtension } from "remirror/extensions";
import { useDrag, useDrop } from "react-dnd";

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
    <React.Suspense fallback="loading...">
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
        {current.context.editors.map(([id, ref], i) => (
          // <DemoInput key={id} id={id} editorRef={ref} />
          <Editor
            key={id}
            id={id}
            editorRef={ref}
            index={i}
            sendParent={send}
          />
        ))}
      </div>
    </React.Suspense>
  );
}

type EditorProps = {
  id: string;
  sendParent: EditorManagerEventSender;
  editorRef: SectionEditorActorRef;
  index: number;
  // level: 1 | 2 | 3 | 4 | 5 | 6;
  // initialState?: EditorState,
};

type EditorHandle = {
  getBodyState(): EditorState;
};

export const ItemTypes = {
  Editor: "editor",
};

type EditorItem = {
  id: string;
  index: number;
};

const Editor = React.forwardRef<EditorHandle, EditorProps>(
  ({ id, sendParent, editorRef, index }: EditorProps, forwardedRef) => {
    const ref = React.useRef(null);
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

    const [{ isDragging }, drag] = useDrag(
      () => ({
        type: ItemTypes.Editor,
        item: { id, index },
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging(),
        }),
        end: (item, monitor) => {
          console.log("end item: ", item);
        },
      }),
      [id, index]
    );

    const [, drop] = useDrop(
      () => ({
        accept: ItemTypes.Editor,
        hover(item: EditorItem, monitor) {
          console.log("hover item: ", item);
          if (!ref.current) {
            return null;
          }

          if (item.index === index) {
            return;
          }

          const hoverBoundingRect = (
            ref.current as any
          ).getBoundingClientRect();
          const clientOffset = monitor.getClientOffset();
          if (!clientOffset) {
            return null;
          }

          const hoverMiddleY =
            (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
          const hoverClientY = clientOffset.y - hoverBoundingRect.top;

          if (
            (item.index < index && hoverClientY < hoverMiddleY) ||
            (item.index > index && hoverClientY > hoverMiddleY)
          ) {
            return null;
          }

          React.startTransition(() => {
            sendParent({
              type: "REORDER_EDITOR",
              prevIndex: item.index,
              nextIndex: index,
            });
          });

          item.index = index;
        },
      }),
      [id, index]
    );

    if (isDragging) {
      console.log(id, index);
    }

    drag(drop(ref));

    return (
      <>
        <div
          style={{ border: "1px solid", opacity: isDragging ? "0.5" : "1" }}
          ref={ref}
        >
          <Remirror key={id} manager={manager} autoRender="end">
            <EditorInteractions editorRef={editorRef} />
          </Remirror>
        </div>
      </>
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

import * as React from "react";
import { useActor } from "@xstate/react";
import { useEditorDomRef, useEditorEvent } from "@remirror/react";

import { type SectionEditorActorRef } from "../../../core/machines/sectionEditor.machine";

type EditorInteractionsProps = {
  sectionRef: SectionEditorActorRef;
  match?: RegExpMatchArray;
};
export function EditorInteractions({ sectionRef }: EditorInteractionsProps) {
  const [sectionEditor, send] = useActor(sectionRef);

  const headingRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = useEditorDomRef();

  React.useEffect(() => {
    if (headingRef.current && bodyRef.current) {
      send({
        type: "INIT",
        headingElement: () => headingRef.current,
        bodyElement: () => bodyRef.current as HTMLDivElement,
      });
    }
  }, []);

  const handleBodyFocus = React.useCallback(() => {
    send("FOCUS_BODY");
  }, []);

  const handleBodyKeyDown = React.useCallback<React.KeyboardEventHandler>(
    (e) => {
      if (e.code === "Backspace") {
        send("INPUT_BACKSPACE");
      }
    },
    []
  );

  useEditorEvent("keydown", handleBodyKeyDown as any);
  useEditorEvent("focus", handleBodyFocus);

  return (
    <input
      type="text"
      ref={headingRef}
      data-level={sectionEditor.context.level}
      data-part="section-editor-heading"
      onKeyDown={(e) => {
        if (e.code === "Backspace") {
          send("INPUT_BACKSPACE");
        }
        if (e.code === "Enter") {
          e.preventDefault();
          send("FOCUS_BODY");
        }
      }}
      onChange={() => {
        send("CHANGE_HEADING");
      }}
      onFocus={() => {
        send("FOCUS_HEADING");
      }}
    />
  );
}

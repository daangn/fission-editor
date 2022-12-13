import { Remirror, useRemirror } from "@remirror/react";
import { htmlToProsemirrorNode } from "remirror";

import { HeadingExtension } from "../core/remirror/headingExtension";
import { type SectionEditorActorRef } from "../core/machines/sectionEditor.machine";
import EditorInteractions from "./EditorInteractions";
import { type EditorManagerEventSender } from "../core/machines/editorManager.machine";
import { type EditorEventOutput, type EventHandler } from "../types/event";

export interface SectionEditorProps<T> extends EventHandler<T> {
  id: string;
  sectionRef: SectionEditorActorRef;
  sendParent: EditorManagerEventSender;
}

const SectionEditor: React.FC<SectionEditorProps<EditorEventOutput>> = ({
  id,
  sectionRef,
  sendParent,
}) => {
  const emitter = (_match: RegExpMatchArray) => {
    sendParent("SPAWN_EDITOR");
  };
  const { manager } = useRemirror({
    extensions: () => [new HeadingExtension(emitter)],
    stringHandler: htmlToProsemirrorNode,
  });

  return (
    <div data-part="section-editor">
      <Remirror key={id} manager={manager} autoRender="end">
        <EditorInteractions sectionRef={sectionRef} />
      </Remirror>
    </div>
  );
};

export default SectionEditor;

import * as React from "react";
import { useActor } from "@xstate/react";
import { Remirror, useRemirror } from "@remirror/react";
import { htmlToProsemirrorNode } from "remirror";

import { HeadingExtension } from "../core/remirror/headingExtension";
import { type SectionEditorActorRef } from "../core/machines/sectionEditor.machine";
import EditorInteractions from "./EditorInteractions";
import { type EventHandler } from "../types/event";
import { EditorManager } from "../context/EditorManager";

export type SectionEditorProps = EventHandler & {
  id: string;
  sectionRef: SectionEditorActorRef;
  className?: string;
};

const SectionEditor: React.FC<SectionEditorProps> = ({
  id,
  sectionRef,
  className,
}) => {
  const editorManagerRef = React.useContext(EditorManager);
  const [_current, send] = useActor(editorManagerRef);

  const emitter = (_match: RegExpMatchArray) => {
    send("SPAWN_EDITOR");
  };
  const { manager } = useRemirror({
    extensions: () => [new HeadingExtension(emitter)],
    stringHandler: htmlToProsemirrorNode,
  });

  return (
    <div data-part="section-editor" className={className}>
      <Remirror key={id} manager={manager} autoRender="end">
        <EditorInteractions sectionRef={sectionRef} />
      </Remirror>
    </div>
  );
};

export default SectionEditor;

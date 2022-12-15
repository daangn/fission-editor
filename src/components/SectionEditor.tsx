import * as React from "react";
import { useActor } from "@xstate/react";
import { Remirror, useRemirror } from "@remirror/react";
import { htmlToProsemirrorNode } from "remirror";
import {
  BoldExtension,
  BulletListExtension,
  OrderedListExtension,
  HardBreakExtension,
} from "remirror/extensions";

import { HeadingExtension } from "../core/remirror/headingExtension";
import { type SectionEditorActorRef } from "../core/machines/sectionEditor.machine";
import EditorInteractions from "./EditorInteractions";
import { type EventHandler } from "../types/event";
import { EditorManager } from "../context/EditorManager";
import { CustomKeymapExtension } from "../core/remirror/customKeymapExtension";

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
  const [match, setMatch] = React.useState<RegExpMatchArray>();

  const emitter = (match: RegExpMatchArray) => {
    setMatch(match);
    send("SPAWN_EDITOR");
  };
  const { manager, state, setState } = useRemirror({
    extensions: () => [
      new HeadingExtension(emitter),
      new CustomKeymapExtension(),
      new BulletListExtension(),
      new OrderedListExtension(),
      new HardBreakExtension(),
      new BoldExtension(),
    ],
    stringHandler: htmlToProsemirrorNode,
  });

  return (
    <div data-part="section-editor" className={className}>
      <Remirror
        key={id}
        manager={manager}
        autoRender="end"
        state={state}
        onChange={(parameter) => {
          setState(parameter.state);
        }}
      >
        <EditorInteractions sectionRef={sectionRef} match={match} />
      </Remirror>
    </div>
  );
};

export default SectionEditor;

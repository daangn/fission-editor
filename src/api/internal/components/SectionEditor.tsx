import * as React from "react";
import { Remirror, useRemirror } from "@remirror/react";
import { htmlToProsemirrorNode } from "remirror";
import { findChildren } from "@remirror/core-utils";
import {
  BoldExtension,
  BulletListExtension,
  OrderedListExtension,
  HardBreakExtension,
} from "remirror/extensions";

import { HeadingExtension } from "../../../core/remirror/headingExtension";
import { EditorInteractions } from "./EditorInteractions";
import { pasteRules } from "prosemirror-paste-rules";
import { SectionEditorActorRef } from "../../../core/machines/sectionEditor.machine";
import { useEditorManagerSender } from "../context/EditorManagerSender";

export type SectionEditorProps = {
  id: string;
  sectionRef: SectionEditorActorRef;
  className?: string;
};

const SectionEditor: React.FC<SectionEditorProps> = ({
  id,
  sectionRef,
  className,
}) => {
  const sendParent = useEditorManagerSender();
  const [match, setMatch] = React.useState<RegExpMatchArray>();

  const emitter = (match: RegExpMatchArray) => {
    setMatch(match);
    sendParent("SPAWN_EDITOR");
  };

  const pasteEmitter = (match: RegExpMatchArray) => {};

  const { manager, state, setState } = useRemirror({
    extensions: () => [
      new HeadingExtension(emitter, pasteEmitter),
      new BulletListExtension(),
      new OrderedListExtension(),
      new HardBreakExtension(),
      new BoldExtension(),
    ],
    plugins: [pasteRules([])],
    stringHandler: htmlToProsemirrorNode,
  });

  const headings = findChildren({
    node: state.doc,
    predicate: (child) =>
      child.node.isBlock && child.node.type.name === "heading",
  });

  for (let i = 1; i < headings.length; i++) {
    state.doc.slice(headings[i - 1].pos, headings[i].pos);
  }

  const slices = headings.map((heading) => {
    return state.doc.slice(heading.pos);
  });

  return (
    <div data-part="section-editor" className={className}>
      <Remirror key={id} manager={manager} autoRender="end">
        <EditorInteractions sectionRef={sectionRef} match={match} />
      </Remirror>
    </div>
  );
};

export default SectionEditor;

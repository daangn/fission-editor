import * as React from "react";
import { useActor } from "@xstate/react";
import { Remirror, useRemirror } from "@remirror/react";
import { htmlToProsemirrorNode } from "remirror";
import { findChildren } from "@remirror/core-utils";
import {
  BoldExtension,
  BulletListExtension,
  OrderedListExtension,
  HardBreakExtension,
} from "remirror/extensions";

import { HeadingExtension } from "../core/remirror/headingExtension";
import EditorInteractions from "./EditorInteractions";
import { type EventHandler } from "../types/event";
import { EditorManager } from "../context/EditorManager";
import { pasteRules, type PasteRule } from "prosemirror-paste-rules";
import { type Section } from "../hooks/useEditors";

export type SectionEditorProps = EventHandler & {
  id: string;
  section: Section;
  className?: string;
};

const SectionEditor: React.FC<SectionEditorProps> = ({
  id,
  section,
  className,
}) => {
  const editorManagerRef = React.useContext(EditorManager);
  const [_current, send] = useActor(editorManagerRef);
  const [match, setMatch] = React.useState<RegExpMatchArray>();

  const emitter = (match: RegExpMatchArray) => {
    setMatch(match);
    send("SPAWN_EDITOR");
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
      <Remirror
        key={id}
        manager={manager}
        autoRender="end"
        state={state}
        onChange={(parameter) => {
          setState(parameter.state);
        }}
      >
        <EditorInteractions section={section} match={match} />
      </Remirror>
    </div>
  );
};

export default SectionEditor;

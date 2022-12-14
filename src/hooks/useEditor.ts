import * as React from "react";
import { useActor } from "@xstate/react";

import { EditorManager } from "../context/EditorManager";
import { SectionEditorActorRef } from "../core/machines/sectionEditor.machine";

export type Editor = {
  id: string;
  sectionEditorRef: SectionEditorActorRef;
};

export function useEditor() {
  const editorManagerRef = React.useContext(EditorManager);
  const [current, send] = useActor(editorManagerRef);

  return current.context.editors.map(([id, sectionEditorRef]) => ({
    id,
    sectionEditorRef,
  }));
}

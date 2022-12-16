import * as React from "react";
import { useActor } from "@xstate/react";

import { EditorManager } from "../context/EditorManager";
import {
  SectionEditorStateValue,
  type SectionEditorContext,
} from "../core/machines/sectionEditor.machine";

export type Section = {
  id: string;
  getData: () => SectionEditorContext;
  matches: (target: SectionEditorStateValue) => boolean;
};

export function useEditors(): Section[] {
  const editorManagerRef = React.useContext(EditorManager);
  const [current, send] = useActor(editorManagerRef);

  return current.context.editors.map(([id, sectionEditorRef]) => {
    const snapshot = sectionEditorRef.getSnapshot();
    if (!snapshot) {
      throw new Error("Not initialized");
    }

    return {
      id,
      getData() {
        return snapshot.context;
      },
      matches(target: SectionEditorStateValue) {
        return snapshot.matches(target);
      },
    };
  });
}

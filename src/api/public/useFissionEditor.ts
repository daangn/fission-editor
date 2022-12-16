import * as React from "react";

import { type SectionControl } from "./types";
import { type SectionEditorActorRef } from "../../core/machines/sectionEditor.machine";
import { useEditorRefs } from "../internal/useEditors";
import { useCurrentEditorId } from "../internal/useCurrentEditorId";
import { SectionControlWithInternal } from "./useSection";

type FissionEditorContext = {
  sections: SectionControl[];
  activeSection: SectionControl | null;
};

export function useFissionEditor(): FissionEditorContext {
  const editorRefs = useEditorRefs();
  const currentEditorId = useCurrentEditorId();

  return {
    sections: editorRefs.map(([editorId, editorRef]) => {
      const section = convertRefToSectionControl(editorId, editorRef);

      if (!section) {
        throw new Error("Not initialized");
      }

      return section;
    }),
    activeSection: convertRefToSectionControl(
      currentEditorId,
      editorRefs.find(([editorId]) => editorId === currentEditorId)?.[1]
    ),
  };
}

function convertRefToSectionControl(
  id?: string | null,
  ref?: SectionEditorActorRef
): SectionControl | null {
  if (!id) {
    return null;
  }
  if (!ref) {
    return null;
  }
  const snapshot = ref.getSnapshot();
  if (!snapshot) {
    throw new Error("Not initialized");
  }
  const control: SectionControlWithInternal = {
    _editorRef: ref,
    id: id,
    setHeading: (heading: string) => {},
    setMetadata: (metadata: unknown) => {},
    focusEditor: (props) => {},
  };
  return control;
}

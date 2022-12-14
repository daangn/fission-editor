import * as React from "react";
import { useActor } from "@xstate/react";

import { type SectionEditorActorRef } from "../core/machines/sectionEditor.machine";

export type useSectionProps = {
  sectionEditorRef: SectionEditorActorRef;
};

export function useSection({ sectionEditorRef }: useSectionProps) {
  const [current, send] = useActor(sectionEditorRef);

  return current.context;
}

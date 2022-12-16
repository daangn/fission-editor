import { useActor } from "@xstate/react";
import { SectionEditorActorRef } from "../../core/machines/sectionEditor.machine";
import { SectionControl, SectionData } from "./types";

export type SectionControlWithInternal = SectionControl & {
  _editorRef: SectionEditorActorRef;
};

export function useSection(control: SectionControl): SectionData {
  const controlEx = control as SectionControlWithInternal;

  const [current] = useActor(controlEx._editorRef);

  return {
    id: control.id,
    heading: current.context.headingElement()?.value ?? "",
    metadata: {},
  };
}

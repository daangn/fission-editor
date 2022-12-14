import { useActor } from "@xstate/react";

import { type SectionEditorActorRef } from "../core/machines/sectionEditor.machine";
import { type EventHandler } from "../types/event";

export type SectionOutlinerProps = EventHandler & {
  sectionRef: SectionEditorActorRef;
};
const SectionOutlinerItem: React.FC<SectionOutlinerProps> = ({
  sectionRef,
}) => {
  const [current] = useActor(sectionRef);

  return <div data-part="section-outliner-item">{current.context.heading}</div>;
};

export default SectionOutlinerItem;

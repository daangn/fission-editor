import { useActor } from "@xstate/react";

import { type SectionEditorActorRef } from "../core/machines/sectionEditor.machine";
import { type EventHandler } from "../types/event";

interface SectionOutlinerProps<T> extends EventHandler<T> {
  sectionRef: SectionEditorActorRef;
}
const SectionOutlinerItem: React.FC<SectionOutlinerProps<{ id: string }>> = ({
  sectionRef,
}) => {
  const [current] = useActor(sectionRef);

  return <div data-part="section-outliner-item">{current.context.heading}</div>;
};

export default SectionOutlinerItem;

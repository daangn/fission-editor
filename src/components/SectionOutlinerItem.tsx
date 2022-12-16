import { useActor } from "@xstate/react";

import { type Section } from "../hooks/useEditors";
import { type EventHandler } from "../types/event";

export type SectionOutlinerProps = EventHandler & {
  section: Section;
};
const SectionOutlinerItem: React.FC<SectionOutlinerProps> = ({ section }) => {
  const sectionContext = section.getData();

  return <div data-part="section-outliner-item">{sectionContext.heading}</div>;
};

export default SectionOutlinerItem;

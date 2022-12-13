import * as React from "react";
import { useActor } from "@xstate/react";

import { EditorManager } from "../context/EditorManager";
import { type EventHandler } from "../types/event";
import SectionOutlinerItem from "./SectionOutlinerItem";

interface SectionOutlinerProps<T> extends EventHandler<T> {
  className?: string;
}

const SectionOutliner: React.FC<SectionOutlinerProps<{ id: string }>> = ({
  className,
  ...props
}) => {
  const editorManagerRef = React.useContext(EditorManager);
  const [current, send] = useActor(editorManagerRef);

  return (
    <div data-part="section-outliner">
      {current.context.editors.map(([id, ref]) => (
        <SectionOutlinerItem key={id} sectionRef={ref} {...props} />
      ))}
    </div>
  );
};

export default SectionOutliner;

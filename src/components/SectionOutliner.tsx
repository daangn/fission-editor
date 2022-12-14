import * as React from "react";

import { type EventHandler } from "../types/event";

export type SectionOutlinerProps = EventHandler & {
  className?: string;
  children: React.ReactNode;
};

const SectionOutliner: React.FC<SectionOutlinerProps> = ({
  className,
  children,
}) => {
  return (
    <div data-part="section-outliner" className={className}>
      {children}
    </div>
  );
};

export default SectionOutliner;

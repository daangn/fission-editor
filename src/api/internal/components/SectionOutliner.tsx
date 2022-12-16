import * as React from "react";

export type SectionOutlinerProps = {
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

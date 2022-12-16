export type SectionData = {
  id: string;
  heading: string | null;
  metadata: unknown;
};

export type SectionControl = {
  id: string;
  setHeading: (heading: string) => void;
  setMetadata: (metadata: unknown) => void;
  focusEditor: (props?: FocusProps) => void;
};

type FocusProps = {
  scrollIntoView?: boolean;
};

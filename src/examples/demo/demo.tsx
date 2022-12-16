import * as React from "react";

import * as FissionEditor from "../..";
import { SectionControl } from "../..";

export default function Demo() {
  return (
    <FissionEditor.Provider>
      <MySectionOutliner />
      <FissionEditor.DocumentEditor className="my-editor" />
    </FissionEditor.Provider>
  );
}

function MySectionOutliner() {
  const { sections, activeSection } = FissionEditor.useFissionEditor();

  console.log(sections);

  return (
    <ul>
      {sections.map((section) => (
        <li
          key={section.id}
          className={section === activeSection ? "active" : undefined}
          onClick={() => {
            section.focusEditor({
              scrollIntoView: true,
            });
          }}
        >
          <MySectionItem section={section} />
        </li>
      ))}
    </ul>
  );
}

function MySectionItem({ section }: { section: SectionControl }) {
  const { heading } = FissionEditor.useSection(section);
  return <span>{heading}</span>;
}

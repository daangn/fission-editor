import * as React from "react";

import SectionEditor from "../internal/components/SectionEditor";
import { useEditorRefs } from "../internal/useEditors";
import { useEditorManagerSender } from "../internal/context/EditorManagerSender";

type FissionDocumentEditorProps = {
  className?: string;
};

export function FissionDocumentEditor({
  className,
}: FissionDocumentEditorProps) {
  const sendParent = useEditorManagerSender();
  const editorRefs = useEditorRefs();

  return (
    <div
      tabIndex={0}
      className={className}
      data-part="document-editor"
      onFocus={() => {
        sendParent("ACTIVATE");
      }}
      onBlur={() => {
        sendParent("DEACTIVATE");
      }}
    >
      {editorRefs.map(([id, ref]) => (
        <SectionEditor key={id} id={id} sectionRef={ref} />
      ))}
    </div>
  );
}

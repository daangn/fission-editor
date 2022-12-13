import * as React from "react";

import DocumentEditor from "../../components/DocumentEditor";
import SectionOutliner from "../../components/SectionOutliner";
import { EditorManagerProvider } from "../../context/EditorManager";

export default function Demo() {
  return (
    <EditorManagerProvider>
      <div>
        <SectionOutliner />
        <DocumentEditor />
      </div>
    </EditorManagerProvider>
  );
}

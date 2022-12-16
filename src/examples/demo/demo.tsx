import * as React from "react";

import DocumentEditor from "../../components/DocumentEditor";
import SectionEditor from "../../components/SectionEditor";
import SectionOutliner from "../../components/SectionOutliner";
import SectionOutlinerItem from "../../components/SectionOutlinerItem";
import { useEditors } from "../../hooks/useEditors";
import { type EditorManagerContext } from "../../core/machines/editorManager.machine";
import { useEditorDispatch } from "../../hooks/useEditorDispatch";

export default function Demo() {
  const editors = useEditors();
  const dispatch = useEditorDispatch();

  const onFocus = (editorId: string) => {
    // console.log("focus", editorId);
  };

  const onBlur = (editorId: string) => {
    // console.log("blur", editorId);
  };

  const onChange = (editors: EditorManagerContext["editors"]) => {
    // console.log("onChange", editors);
  };

  return (
    <div>
      <div>
        <SectionOutliner>
          {editors.map((section) => (
            <SectionOutlinerItem key={section.id} section={section} />
          ))}
        </SectionOutliner>
        <DocumentEditor onFocus={onFocus} onBlur={onBlur} onChange={onChange}>
          {editors.map((section) => (
            <SectionEditor key={section.id} id={section.id} section={section} />
          ))}
        </DocumentEditor>
      </div>
      <div>
        <button
          onClick={() => {
            dispatch.create();
          }}
        >
          create
        </button>
      </div>
    </div>
  );
}

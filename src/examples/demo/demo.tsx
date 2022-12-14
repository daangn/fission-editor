import * as React from "react";

import DocumentEditor from "../../components/DocumentEditor";
import SectionEditor from "../../components/SectionEditor";
import SectionOutliner from "../../components/SectionOutliner";
import SectionOutlinerItem from "../../components/SectionOutlinerItem";
import { useEditor } from "../../hooks/useEditor";
import { type EditorManagerContext } from "../../core/machines/editorManager.machine";
import { useEditorDispatch } from "../../hooks/useEditorDispatch";

export default function Demo() {
  const editors = useEditor();
  const dispatch = useEditorDispatch();

  const onFocus = (editorId: string) => {
    console.log("focus", editorId);
  };

  const onBlur = (editorId: string) => {
    console.log("blur", editorId);
  };

  const onChange = (editors: EditorManagerContext["editors"]) => {
    console.log("onChange", editors);
  };

  return (
    <div>
      <div>
        <SectionOutliner>
          {editors.map(({ id, sectionEditorRef }) => (
            <SectionOutlinerItem key={id} sectionRef={sectionEditorRef} />
          ))}
        </SectionOutliner>
        <DocumentEditor onFocus={onFocus} onBlur={onBlur} onChange={onChange}>
          {editors.map(({ id, sectionEditorRef }) => (
            <SectionEditor key={id} id={id} sectionRef={sectionEditorRef} />
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

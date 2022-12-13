import * as React from "react";
import { useActor } from "@xstate/react";

import { EditorManager } from "../context/EditorManager";
import SectionEditor from "./SectionEditor";
import { type EditorEventOutput, type EventHandler } from "../types/event";

export interface DocumentEditorProps<T> extends EventHandler<T> {
  className?: string;
}

const DocumentEditor: React.FC<DocumentEditorProps<EditorEventOutput>> = ({
  className,
  ...props
}) => {
  const editorManagerRef = React.useContext(EditorManager);
  const [current, send] = useActor(editorManagerRef);

  React.useEffect(() => {
    const editorId = current.context.currentEditorId;
    if (editorId) {
      send({ type: "FOCUS_EDITOR", id: editorId });
    }
  }, [current.context.currentEditorId]);

  return (
    <div
      tabIndex={0}
      className={className}
      data-part="document-editor"
      style={{
        width: "100%",
        minHeight: "200px",
        border: "1px solid",
        display: "flex",
        flexDirection: "column",
      }}
      onFocus={() => {
        send("ACTIVATE");
      }}
      onBlur={() => {
        send("DEACTIVATE");
      }}
    >
      {current.context.editors.map(([id, ref]) => (
        <SectionEditor
          key={id}
          id={id}
          sectionRef={ref}
          sendParent={send}
          {...props}
        />
      ))}
    </div>
  );
};

export default DocumentEditor;

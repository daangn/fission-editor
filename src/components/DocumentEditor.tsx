import * as React from "react";
import { useActor } from "@xstate/react";

import { EditorManager } from "../context/EditorManager";
import { type EventHandler } from "../types/event";

export type DocumentEditorProps = EventHandler & {
  className?: string;
  children: React.ReactNode;
};

const DocumentEditor: React.FC<DocumentEditorProps> = ({
  className,
  onFocus,
  onBlur,
  onChange,
  children,
}) => {
  const editorManagerRef = React.useContext(EditorManager);
  const [current, send] = useActor(editorManagerRef);

  React.useEffect(() => {
    const editorId = current.context.currentEditorId;
    if (editorId) {
      send({ type: "FOCUS_EDITOR", id: editorId });

      onFocus && onFocus(editorId);
    }
  }, [current.context.currentEditorId]);

  React.useEffect(() => {
    onChange && onChange(current.context.editors);
  }, [current.context.editors]);

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

        onBlur && onBlur(current.context.currentEditorId as string);
      }}
    >
      {children}
    </div>
  );
};

export default DocumentEditor;

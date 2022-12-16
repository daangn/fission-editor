import * as React from "react";

import { type EditorManagerEventSender } from "../../../core/machines/editorManager.machine";

export const EditorManagerSender =
  React.createContext<EditorManagerEventSender | null>(null);

export function useEditorManagerSender(): EditorManagerEventSender {
  const sender = React.useContext(EditorManagerSender);
  if (!sender) {
    throw new Error("Shoud wrap by FissionEditor.Provider!");
  }
  return sender;
}

import * as React from "react";

import { type EditorManagerActorRef } from "../../../core/machines/editorManager.machine";

export const EditorManagerService =
  React.createContext<EditorManagerActorRef | null>(null);

export function useEditorManagerService(): EditorManagerActorRef {
  const service = React.useContext(EditorManagerService);
  if (!service) {
    throw new Error("Shoud wrap by FissionEditor.Provider!");
  }
  return service;
}

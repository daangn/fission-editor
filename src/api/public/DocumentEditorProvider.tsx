import { useMachine } from "@xstate/react";
import * as React from "react";

import { editorManagerMachine } from "../../core/machines/editorManager.machine";
import { EditorManagerSender } from "../internal/context/EditorManagerSender";
import { EditorManagerService } from "../internal/context/EditorManagerService";

type FissionDocumentEditorProviderProps = {
  children: React.ReactNode;
};

export function FissionDocumentEditorProvider({
  children,
}: FissionDocumentEditorProviderProps) {
  const [_current, send, service] = useMachine(editorManagerMachine, {
    devTools: true,
    context: {
      editors: [],
      currentEditorId: null,
    },
  });

  return (
    <EditorManagerSender.Provider value={send}>
      <EditorManagerService.Provider value={service}>
        {children}
      </EditorManagerService.Provider>
    </EditorManagerSender.Provider>
  );
}

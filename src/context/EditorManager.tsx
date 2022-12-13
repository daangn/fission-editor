import * as React from "react";
import { useMachine } from "@xstate/react";

import {
  type EditorManagerActorRef,
  editorManagerMachine,
} from "../core/machines/editorManager.machine";

export const EditorManager = React.createContext<EditorManagerActorRef>(
  null as any
);

type EditorManagerProviderProps = {
  children: React.ReactNode;
};
export const EditorManagerProvider: React.FC<EditorManagerProviderProps> = ({
  children,
}) => {
  const [_current, _send, ref] = useMachine(editorManagerMachine, {
    devTools: true,
    context: {
      editors: [],
      currentEditorId: null,
    },
  });

  return (
    <EditorManager.Provider value={ref}>{children}</EditorManager.Provider>
  );
};

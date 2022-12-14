import * as React from "react";
import { useActor } from "@xstate/react";

import { EditorManager } from "../context/EditorManager";

export function useEditorDispatch() {
  const editorManagerRef = React.useContext(EditorManager);
  const [_current, send] = useActor(editorManagerRef);

  return {
    destroy: (id: string) =>
      send({
        type: "DESTROY_EDITOR",
        id,
      }),
    create: () =>
      send({
        type: "SPAWN_EDITOR",
      }),
    focus: (id: string) => {
      send({
        type: "FOCUS_EDITOR",
        id,
      });
    },
  };
}

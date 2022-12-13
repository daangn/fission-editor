import { useActor } from "@xstate/react";

import { type EditorManagerActorRef } from "../core/machines/editorManager.machine";

export function useSectionDispatch({ ref }: { ref: EditorManagerActorRef }) {
  const [current, send] = useActor(ref);

  return {
    destroy: (id: string) => {
      send({
        type: "DESTROY_EDITOR",
        id,
      });
    },
    create: (id: string) => {
      send({
        type: "SPAWN_EDITOR",
      });
    },
    focus: (id: string) => {
      send({
        type: "FOCUS_EDITOR",
        id,
      });
    },
  };
}

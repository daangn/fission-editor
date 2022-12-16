import { useSelector } from "@xstate/react";
import { EditorManagerState } from "../../core/machines/editorManager.machine";
import { useEditorManagerService } from "./context/EditorManagerService";

function selectCurrentEditorId(state: EditorManagerState): string | null {
  return state.context.currentEditorId;
}

export function useCurrentEditorId() {
  const service = useEditorManagerService();
  return useSelector(service, selectCurrentEditorId);
}

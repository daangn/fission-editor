import { useSelector } from "@xstate/react";
import { EditorManagerState } from "../../core/machines/editorManager.machine";
import { SectionEditorActorRef } from "../../core/machines/sectionEditor.machine";
import { useEditorManagerService } from "./context/EditorManagerService";

function selectEditorRefs(
  state: EditorManagerState
): Array<[string, SectionEditorActorRef]> {
  return state.context.editors;
}

export function useEditorRefs() {
  const service = useEditorManagerService();
  return useSelector(service, selectEditorRefs);
}

import { type EditorManagerContext } from "../core/machines/editorManager.machine";

export type EditorEventOutput = {
  editorId: string;
};

export type EventHandler = {
  onChange?: (editors: EditorManagerContext["editors"]) => void;
  onFocus?: (editorId: string) => void;
  onBlur?: (editorId: string) => void;
};

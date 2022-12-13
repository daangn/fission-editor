export interface EditorEventOutput {
  editorId: string;
}

export interface EventHandler<T> {
  onChange?: (e: React.ChangeEvent) => void;
  onFocus?: (e: React.FocusEvent) => T;
  onBlur?: (e: React.MouseEvent) => T;
}

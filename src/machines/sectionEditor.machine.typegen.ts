// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: "mergeSectionBody";
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    changeBody: "CHANGE_BODY";
    changeHeading: "CHANGE_HEADING";
    destroySelf: "DEACTIVATE" | "INPUT_BACKSPACE";
    mergeSectionBody: "INPUT_BACKSPACE";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {
    editorBodyHasNoContent: "INPUT_BACKSPACE";
    editorHasNoContent: "DEACTIVATE" | "INPUT_BACKSPACE";
    editorHeadingHasNoContent: "DEACTIVATE" | "INPUT_BACKSPACE";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "focus"
    | "focus.onBody"
    | "focus.onHeading"
    | "idle"
    | "invalid"
    | { focus?: "onBody" | "onHeading" };
  tags: never;
}

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
    assignBodyElement: "INIT";
    assignHeadingElement: "INIT";
    destroySelf: "INPUT_BACKSPACE";
    focusBody: "ACTIVATE_BODY" | "FOCUS_BODY";
    focusHeading:
      | "ACTIVATE"
      | "ACTIVATE_BODY"
      | "FOCUS_HEADING"
      | "INIT"
      | "INPUT_BACKSPACE";
    mergeSectionBody: "INPUT_BACKSPACE";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {
    editorBodyHasNoContent: "INPUT_BACKSPACE";
    editorHasNoContent: "INPUT_BACKSPACE";
    editorHeadingHasNoContent: "DEACTIVATE" | "INPUT_BACKSPACE";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "focus"
    | "focus.history"
    | "focus.onBody"
    | "focus.onHeading"
    | "idle"
    | "invalid"
    | "unstable"
    | { focus?: "onBody" | "onHeading" };
  tags: never;
}

// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    destroyEditor: "DESTROY_EDITOR";
    focusEditor: "ACTIVATE" | "FOCUS_EDITOR" | "SPAWN_EDITOR";
    spawnEditor: "ACTIVATE" | "SPAWN_EDITOR";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {
    hasNoChildren: "ACTIVATE";
  };
  eventsCausingDelays: {};
  matchesStates: "focus" | "idle";
  tags: never;
}

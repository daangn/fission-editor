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
    activateEditor: "ACTIVATE" | "FOCUS_EDITOR" | "SPAWN_EDITOR";
    deactivateEditor: "REORDER_EDITOR" | "SPAWN_EDITOR";
    destroyEditor: "DESTROY_EDITOR";
    reorderEditor: "REORDER_EDITOR";
    spawnEditor: "ACTIVATE" | "SPAWN_EDITOR";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {
    hasNoChildren: "ACTIVATE";
  };
  eventsCausingDelays: {};
  matchesStates: "dragging" | "focus" | "idle";
  tags: never;
}

import { createMachine } from 'xstate';

type Context = {
  test: string,
}

export const sectionEditorMachine = createMachine<Context>({
  id: "sectionEditor",
  initial: "focus",
  states: {
    focus: {
      initial: "onHeading",
      states: {
        onHeading: {
          on: {
            INPUT_HEADING: {},
          },
        },
        onBody: {
          on: {
            INPUT_BODY: {},
            SPAWN_SIBLING: {
              target: "#sectionEditor.idle",
              actions: "spawnSibling",
            },
          },
        },
      },
      on: {
        BLUR: {
          target: "idle",
        },
        FOCUS_HEADING: {
          target: ".onHeading",
        },
        FOCUS_BODY: {
          target: ".onBody",
        },
      },
    },
    idle: {
      on: {
        FOCUS: {
          target: "focus",
        },
      },
    },
  },
  schema: {
    context: {} as Context,
    events: {} as
      | { type: "FOCUS" }
      | { type: "INPUT_HEADING" }
      | { type: "BLUR" }
      | { type: "INPUT_BODY" }
      | { type: "SPAWN_SIBLING" }
      | { type: "FOCUS_HEADING" }
      | { type: "FOCUS_BODY" },
  },
  context: {} as Context,
  predictableActionArguments: true,
  preserveActionOrder: true,
});

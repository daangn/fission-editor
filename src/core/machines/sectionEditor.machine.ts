/* @eslint-disable */
import {
  createMachine,
  assign,
  sendParent,
  type ActorRefFrom,
  type ContextFrom,
  type StateValueFrom,
} from "xstate";
import { assign as immerAssign } from "@xstate/immer";

export type SectionEditorActorRef = ActorRefFrom<typeof sectionEditorMachine>;

export type SectionEditorContext = ContextFrom<typeof sectionEditorMachine>;

export type SectionEditorStateValue = StateValueFrom<
  typeof sectionEditorMachine
>;

export const sectionEditorMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SzAYwC4EsD2A7AohJutgE4B0AZtqgK6wDEAIvgIIDCAKgJIBqrnfAG0ADAF1EoAA7ZYxHLkkgAHogCMAFgCcANnIBmAKxaNOw5q2WdAGhABPREZHkNh-Wp0AmDSK0j9WkYAvkG2KBgKhMRkVDT0zGxcfALCahJIIDJyWHhKqgiaABx6RiZmFla2DgjaAOwuIl6FGp6BxTq1hiFhaDkERCQU1HSMLBw8-IJCnunSsvK5GfkWJcam5tqV9ogapuR+TeZmOiKFat0g4X1Rg7EjDABiAPLsAKoAygD6ABJsTNwAOQA4qJZpl5n08ogtLUqohakYDGpPIYRGpfCitB4LldIgMYsN4s83l8AEJPJgATVBSiyC0US2hsO2CB0mnIhi8hk8vkMhU8zUKON6eOiQzisHIeG+YAAhkRcFAGICAAqvTifUkcADS7xVHGE4lpEIUUIKIg0ahczX0hXc3nRhWZ1WOHMKa0KlkKntqGmFETwNwJEqluBl8swiuVALVGq17F1+vYqTBdMhjPNaPIaidhm5xR8+n0zsQnOcan0As8XhaleK-uu+PFI1D4YVStV6s1Or1BumqZNi1AyxEtStvpOWmKnk8ObhCFRWnIOjrnjHmkalgbotuhMl0rl7YY7G+rGB+B+f0BIKNGTTpozamRS7ZtQFT7UtS0hnnlv02a-N9iydSt9A6bdAybO56FDUlsAgOxo1jbsE17ZMaTvQcGWHUtdH2VxK1MV9OQ0ecV3qNw-H5Wo3w0AItAg-oxWg-dcDghCkK7eNEz7NJjWyB8cIQKtyE9RoeQ0McRBnQxSJZPlxzEhFGn0UczkYoNmxgvB2MQk8zyBC9ySpDC5gEocVEcNxROKWpGkLHQdGKX93QMUpUVUsxfH0DSoMwCAABswAYcZkkETUKWpW8zPpM0vHnT8lwI5FCjRC1i3OUJLhFSDmP8oKQqSSZDQHczsMshdPHnO1yBEOq6u5NxijtLostxXLbkjAA3WUAv8wqJhSUzwTKs1uXnPwl38SadEkzy8xCLLcHguAlHapjBn42LH3nABaQx9ksKdv2MWadC0NdfOYvctvTITtHnQiAJhKsNDtRydCu3cQwPCNFVuwSKqfLwDA9WTBUMBF506QpaoCUdPzzIjMp6AMNuDFsdPg6oYruirbQO7xJ2kqdkV2Mji3IAU-DfNQsSLJyvpifKwABizljteojA8Pl-FHNk5OqWdy0AowOhOW0aKZihut6-y2fKjmYXw2SEWO7QUXnVFPH2T02Qk87AkykIgA */
  createMachine(
    {
      tsTypes: {} as import("./sectionEditor.machine.typegen").Typegen0,
      schema: {
        context: {} as {
          id: string;
          level: 1 | 2 | 3 | 4 | 5 | 6;
          heading: number;
          body: number;
        },
        events: {} as
          | {
              type: "FOCUS_HEADING";
            }
          | {
              type: "FOCUS_BODY";
            }
          | {
              type: "CHANGE_HEADING";
              length: number;
            }
          | {
              type: "CHANGE_BODY";
              length: number;
            }
          | {
              type: "INPUT_BACKSPACE";
            }
          | {
              type: "ACTIVATE";
            }
          | {
              type: "ACTIVATE_BODY";
            }
          | {
              type: "DEACTIVATE";
            }
          | {
              type: "SPAWN_SIBLING";
            },
      },
      preserveActionOrder: true,
      predictableActionArguments: true,
      id: "sectionEditor",
      initial: "focus",
      states: {
        focus: {
          initial: "onHeading",
          states: {
            onHeading: {
              on: {
                INPUT_BACKSPACE: [
                  {
                    cond: "editorHasNoContent",
                    actions: "destroySelf",
                  },
                  {
                    cond: "editorHeadingHasNoContent",
                    actions: "mergeSectionBody",
                  },
                  {},
                ],
                CHANGE_HEADING: {
                  actions: "changeHeading",
                },
              },
            },
            onBody: {
              on: {
                INPUT_BACKSPACE: [
                  {
                    target: "onHeading",
                    cond: "editorBodyHasNoContent",
                  },
                  {},
                ],
                CHANGE_BODY: {
                  actions: "changeBody",
                },
              },
            },
          },
          on: {
            DEACTIVATE: [
              {
                target: "idle",
                cond: "editorHasNoContent",
                actions: "destroySelf",
              },
              {
                target: "invalid",
                cond: "editorHeadingHasNoContent",
              },
              {
                target: "idle",
              },
            ],
            FOCUS_HEADING: {
              target: ".onHeading",
              actions: "focusEditor",
            },
            FOCUS_BODY: {
              target: ".onBody",
              actions: "focusEditor",
            },
          },
        },
        idle: {
          on: {
            ACTIVATE_BODY: {
              target: "#sectionEditor.focus.onBody",
              actions: "focusEditor",
            },
            ACTIVATE: {
              target: "focus",
              actions: "focusEditor",
            },
          },
        },
        invalid: {
          on: {
            ACTIVATE: {
              target: "focus",
              actions: "focusEditor",
            },
          },
        },
      },
    },
    {
      actions: {
        changeHeading: assign({
          heading: (_context, event) => event.length,
        }),
        changeBody: assign({
          body: (_context, event) => event.length,
        }),
        destroySelf: sendParent((context) => ({
          type: "DESTROY_EDITOR",
          id: context.id,
        })),
        focusEditor: sendParent((context) => ({
          type: "FOCUS_EDITOR",
          id: context.id,
        })),
      },
      guards: {
        editorHasNoContent: (context) => {
          return context.heading === 0 && context.body === 0;
        },
        editorHeadingHasNoContent: (context) => {
          return context.heading === 0;
        },
        editorBodyHasNoContent: (context) => {
          return context.body === 0;
        },
      },
    }
  );

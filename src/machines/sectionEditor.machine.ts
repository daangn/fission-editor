/* @eslint-disable */
import { createMachine, assign, sendParent, type ActorRefFrom } from "xstate";
import { assign as immerAssign } from "@xstate/immer";

export type SectionEditorActorRef = ActorRefFrom<typeof sectionEditorMachine>;

export const sectionEditorMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SzAYwC4EsD2A7AohJutgE4B0AZtqgK6wDEAIvgIIDCAKgJIBqrnfAG0ADAF1EoAA7ZYxHLkkgAHogCMAVjVryAZg0BOXWoBMADgAsagxYtmANCACeiXSIvkLB7xYBsIkSNfAHZggF8wxxQMBUJiMioaemY2Lj4BYTUJJBAZOSw8JVUETW09Q2NzKxs7RxcEEw1dcm9vDUsvIzVdCwiotAKCIhIKajpGADEAeXYAVQBlAH0ACTYmbgA5AHFRbOlZeUKc4oNgusRgjRFygxNdEI0NExDfPpBowbiRxPGGabmlgAhKZMACauyUeUOimOiFO5wQvhMJhaFkaZhMFn0dmCJjeH1iwwSY3o5DwyzAAEMiLgoAxNgAFWacRaAjgAaXmDI4wnEkIOgyK6ncOjsWN8ugMamCvj8CNlZnIvg0vjUFnauLMNnCkXeA0J8VGSVgZNwFOpmFp9I2TJZbPYnO57Eye1yAoUQpKAR0ajMwQsoTUEtlIl0CMeKJMofc5jc3nc+P1eC+xONpvNNLpjOZrI5XJ5QhMrqhgthXuCOn9-hlz3ckvDIkr0YjFcevV1BOTRKN43TVMzDHYy1Y23wKzWmx2fJyJY9Ze0JgMSul3UeWkeDmciAsIg05ExbWRi9lBg0iZiXcNP1JeEB2AgTmtttzDvzzohM-dR1AxUMvlRTRBjWIiWGo8qLkqgSYoulwaF4Z4dkmQxXiSJq3vej7ZnaeZOi6-L5HOP6IOYKJaiIEqBGYaqYmcW4ICqwTkNYtbBKGG6NOenzdteaG4HeD6DsOo6siC4LTvsBHfiorhNOQZhmCEvoGP4VzkQiAbXMEko7v6jahLolycQa3yYBAAA2YAMBwPD8IIIlgh+EnQp6SIIgYjZMVBbhNF4ClGZeJnmZZ1npIIjlupJMJEfRJhuVokG3L6gS2Ee-nISZuAAG6UmZplWWktm8sWX5RdJMUIhiLStMEtwHsqIRpSmPbJCwIWFYWxWRZ6mgefoXRVNYtibvUO7XKexjqrKxgyu2uq4PecBKJ26VkPhznzgiAC0-4BAEdiLoYTzaAYjXcaha2ltFXgIsY-4HqcbjuL4Zi6GYCH9BeK3NbxGaWlAF2EWV2hIjcBlIlK0q+AilzXGoUF2FKAbeLop0oWm6EPgDUnFK9e6YqqenRriGjgSivi3IY6qno28mo4FFlY6VxS+mi5RBgG0qnLFdF+EunOscYoYGZYdMJJa2W5RAjPdbVAFouRfpad0bk6CBuhuAejSXH4EQREAA */
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
            },
            FOCUS_BODY: {
              target: ".onBody",
            },
          },
        },
        idle: {
          on: {
            ACTIVATE_BODY: {
              target: "#sectionEditor.focus.onBody",
            },
            ACTIVATE: {
              target: "focus",
            },
          },
        },
        invalid: {
          on: {
            ACTIVATE: {
              target: "focus",
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

/* @eslint-disable */
import {
  createMachine,
  assign,
  sendParent,
  type ActorRefFrom,
  type ContextFrom,
  type StateValueFrom,
  StateFrom,
} from "xstate";

export type SectionEditorActorRef = ActorRefFrom<typeof sectionEditorMachine>;

export type SectionEditorContext = ContextFrom<typeof sectionEditorMachine>;

export type SectionEditorStateValue = StateValueFrom<
  typeof sectionEditorMachine
>;

export type SectionEditorState = StateFrom<typeof sectionEditorMachine>;

export const sectionEditorMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SzAYwC4EsD2A7AohJutgE4B0AZtqgK6wDEAIvgIIDCAKgJIBqrnfAG0ADAF1EoAA7ZYxHLkkgAHogCMADjVryakQE41AZgCsAdn1GzGkwBoQAT0QAmM2fL6AbEeMmALEYaziIizgC+YfYoGAqExGRUNPTMbFx8AsJqEkggMnJYeEqqCJoiOnqGphZWNvZOCH7Ofh5qnq3ORn4iAVZ+EVFoBQREJBTUdIwAYgDy7ACqAMoA+gASbEzcAHIA4qLZ0rLyhTnFftrkZiYhJmodahZm3XWIbe5G+s76bmomJhoang0-RA0SGcVGiQmDBm82WACFpkwAJp7JR5I6KE6IM6eC5XEQ3O4PJ6ObEafTkZzONpXSw3PyePqREGDWIjBLjejkPArMAAQyIuCgDC2AAU5pwlnCOABpBaijjCcRow5DIrqUy4jpnf4iHyXESeZ4IG4mXSeRk0gG-NT6YGgtnxMZJWDc3C8gWYIUizbiyXS9hyhXsTL7XKqhTqko+M2WMxGHxtfR+OnGnUXYwiDQBJr6GxMgYxPDgjkut0ewXCsUSqWy+WKoTOMPotVY6MA8gpv4ad7tTx541GQGU4x6PxuUJmYwFllF4ZOyFcnn8ysMdgrVg7fCrdZbXbKnItyNttR+M-kIf9-V6zyuZyD+4ZnzOEzOH6-eP21nF9nOiZuuFsAgBwfT9WtA3rENUUPCNjlAYpDB0fsTE6AFAn8Kc0y8cgAX0G5DBMTwpzPIwvznEs-yXXBAOA0CawDIMGyyFV8mPeDEBML5yEZQ0UwJawRDcNNHyTYJLn7eNXzIsFf3ITAIAAGzABgOB4fhBClREUQPA5WLglREEvPFrlufUvhJep-nccwXz8LRvgtNRpMdCF5KUlS0nUpVm1gzF2IQKxcQNAlTPucy-GNCxyltfEgi8BkZwdH8Fy9AA3PkFPkjy1IyaDdIxKMjOCwkzMeCLSQQHtyBCEJAWCIdCMCZzkohWhcFgdA+QAI3crZuE4PLwz0vyDJKTjqusH5AVvNx9H0Y0Xw0aqOneK5NCnIwXwiZlcCAuAlCS+dRhYgq2wAWiNCqztjObLFPKxPkCd5mqO0sJhO1t-KHIxjJColwoW5wlo27QiMeQSzxeijF1dZdPSFD62NG+73DMK89D+LwzGpY02lxJMrnJTpBNPKHZM5WHqKA+p8s+0bPD+PFrABbR2jmtN410GL7j1bMvFcMmFwp8gAAtMA6sgaaG07-JxX6SrCsq0yBylqTONXfisH5BdcxSwER-TijfRpdDKbQUK6Ht7mVs1WlvM9OOpfxuh1hI0oy+SDZGo2qWcbi8J+DRBMsZNjW0ZoCTmsxxyDz4gk8V2KDajruqUr2o0aBbk1V7xvCB4IPk-bagA */
  createMachine(
    {
      tsTypes: {} as import("./sectionEditor.machine.typegen").Typegen0,
      schema: {
        context: {} as {
          id: string;
          level: 1 | 2 | 3 | 4 | 5 | 6;
          headingElement: () => HTMLInputElement | null;
          bodyElement: () => HTMLDivElement | null;
        },
        events: {} as
          | {
              type: "INIT";
              headingElement: () => HTMLInputElement | null;
              bodyElement: () => HTMLDivElement | null;
            }
          | {
              type: "CHANGE_HEADING";
            }
          | {
              type: "FOCUS_HEADING";
            }
          | {
              type: "FOCUS_BODY";
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
      initial: "unstable",
      states: {
        focus: {
          initial: "onHeading",
          states: {
            onHeading: {
              entry: "focusHeading",
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
                CHANGE_HEADING: {},
              },
            },
            onBody: {
              entry: "focusBody",
              on: {
                INPUT_BACKSPACE: [
                  {
                    target: "onHeading",
                    cond: "editorBodyHasNoContent",
                  },
                  {},
                ],
              },
            },
            history: {
              history: "shallow",
              type: "history",
            },
          },
          on: {
            DEACTIVATE: [
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
              actions: "focusHeading",
            },
            FOCUS_BODY: {
              target: ".onBody",
              actions: "focusBody",
            },
          },
        },
        idle: {
          on: {
            ACTIVATE_BODY: {
              target: "#sectionEditor.focus.onBody",
              actions: "focusBody",
            },
            ACTIVATE: {
              target: "#sectionEditor.focus.history",
              actions: "focusHeading",
            },
          },
        },
        invalid: {
          on: {
            ACTIVATE: {
              target: "focus",
              actions: "focusHeading",
            },
          },
        },
        unstable: {
          on: {
            INIT: {
              target: "focus",
              actions: ["assignHeadingElement", "assignBodyElement"],
            },
          },
        },
      },
    },
    {
      actions: {
        assignHeadingElement: assign({
          headingElement: (_context, event) => event.headingElement,
        }),
        assignBodyElement: assign({
          bodyElement: (_context, event) => event.bodyElement,
        }),
        destroySelf: sendParent((context) => ({
          type: "DESTROY_EDITOR",
          id: context.id,
        })),
        focusHeading: (context) => {
          context.headingElement()!.focus();
        },
        focusBody: (context) => {
          context.bodyElement()!.focus();
        },
      },
      guards: {
        editorHasNoContent: (context) => {
          return (
            context.headingElement()!.value.length === 0 &&
            context.bodyElement()!.innerText.trim().length === 0
          );
        },
        editorHeadingHasNoContent: (context) => {
          return context.headingElement()!.value.length === 0;
        },
        editorBodyHasNoContent: (context) => {
          return context.bodyElement()!.innerText.trim().length === 0;
        },
      },
    }
  );

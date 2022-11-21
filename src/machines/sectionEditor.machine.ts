/* @eslint-disable */
import {
  createMachine,
  sendParent,
  type ActorRefFrom,
} from 'xstate';
import { assign } from '@xstate/immer';

export const sectionEditorMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SzAYwC4EsD2A7AohJutgE4B0AZtqgK6wDEAIvgIIDCAKgJIBqrnfAG0ADAF1EoAA7ZYxHLkkgAHogCMAFgDMI8gHYAbAFYDWtZpFrDAGhABPRDo3kNATneuATFqMAODZ7eWgC+wbYoGAqExGRUNPTMbFx8AsJqEkggMnJYeEqqCJo6+sam5hqWNvaInkbOIg0NrkauWq56WnoaoeFouQREJBTUdIwsHDz8gkKeGdKy8nmZBZqeuoYmZhZWBrYOCBW6zVtatVaaaj0gEf3RQ3GjDABiAPLsAKoAygD6ABJsTG4ADkAOKiOZZBb9fKIdp7RDGLTkVwiAyeLxGTyGfxXG5RQaxEYJV4fH4AIReTAAmuClNlFoplrC9PCEJiDC5fK5TJi9GpOiJPLi+viYsN4rByHhfmAAIZEXBQBjAgAK7043zJHAA0p8VRxhOI6VCFDDCg01OQ1L4ujb0QZ3AZfKyjJjyGszBojBYbb5LmFriK8HdCRKpbgZfLMIrlUC1Rqtexdfr2GkIfToUzzWYXG41q41K1-DaXZZ9CIzJ5rQ6NFzXMLIsGCeLRuHIwqlexfqxQfg-gDgWCjZkM6as2oRFzyKcK4WtNpOrtqgcREZ3UZGiJ2gZC74RHoG7dmw96OGydgIHZY-HNTq9QbaSOTUtQAUWhzXF6dJoNwYnUYXS0JE1E2Swfy9dpD1Fe4iUlPBz0va91VvJN71TIR0mNHIx1fGpfE8cguVRKtjA0P9PCXfYND0dY2gMVc9BaVpGKgpsxRPODcAQq8ux7EE+wpalH3mbCXxURwjCRXxfAMPlP38TRnWXTpnE8GTa1rP8DC9YxWIGdjYLPC8r3vAB1IFvk+bgyQAGUHYTIVExlcMKDQJxKTZykqSjEC9S0v35YxvAnII9JDChMAgAAbMAGAmFJBE1SkaWHESGTNNFWT3ZxSixFpC1XecwuPSKYri5IpkNdNn2c8S2U8LLXStEwsTIoLzHrAM8TY+5owAN1lKLIvKyZUgc0cxLfBrl18JFNwtIjrTU0IA1wC84CUbr9KGLD0vHVkAFoOXmoDairAtui6oNttDUZdszFy3FZNS1zU7S3GMFEd2Kgyw2lOUO3unC6vMQJyGItwtD9dEulZRFyFyv8Kzch1fB+mC-q44ygcmxxfFesj9z9QxTB3Hz6o5bxuXRWdThMdHYlKsAcdqlZDEtRi9BJvR5InJSqIdK0eYdVpqOo5oGYi3ABqGiAWbNa0Amnb0-BRa1ThZZcC3B2bTm0rkOksEIVqAA */
  createMachine({
    tsTypes: {} as import("./sectionEditor.machine.typegen").Typegen0,
    schema: {
      context: {} as {
        id: string;
        heading: string;
        body: string;
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
          value: string;
        }
        | {
          type: "CHANGE_BODY";
          value: string;
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
              SPAWN_SIBLING: {
                target: "#sectionEditor.idle",
                actions: "spawnSibling",
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
  }, {
    actions: {
      changeHeading: assign((context, event) => {
        context.heading = event.value;
      }),
      changeBody: assign((context, event) => {
        context.body = event.value
      }),
      destroySelf: sendParent((context) => ({
        type: 'DESTROY_EDITOR',
        id: context.id,
      })),
      spawnSibling: sendParent('SPAWN_EDITOR'),
    },
    guards: {
      editorHasNoContent: (context) => {
        return !(context.heading || context.body);
      },
      editorHeadingHasNoContent: (context) => {
        return !context.heading;
      },
      editorBodyHasNoContent: (context) => {
        return !context.body;
      },
    },
  });

export type SectionEditorActorRef = ActorRefFrom<typeof sectionEditorMachine>;

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
  /** @xstate-layout N4IgpgJg5mDOIC5SzAYwC4EsD2A7AohJutgE4B0AZtqgK6wDEAIvgIIDCAKgJIBqrnfAG0ADAF1EoAA7ZYxHLkkgAHogCMAFgCcANnIBmAKxaATFtMaAHCZ1qANCACeiIyPIbD+k2pE791gHYdLQCAX1CHFAwFQmIyKhp6ZjYuPgFhNQkkEBk5LDwlVQRNSz0jU3MTKxt7J0RtAPdffzVDExNDES1DQ3DItHyCIhIKajpGFg4efkEhEyzpWXkC7KLNXQNjMwtrWwdnBA0NPS1m2wCLgKMTPpAowdiRhPGGADEAeXYAVQBlAH0ABJsJjcAByAHFRAscktBoVECF9ogroYDGoTAFWqUNJjLL0IncBjFhvExkkPt9-gAhd5MACaUKUuWWilWCICSIQtg05EMOhshksIjUeKOt3uxLio0SsHIeABYAAhkRcFAGGCAApfTh-KkcADSPw1HGE8yZsIU8OKOJ5V0xpyuIkM6J0nIuJnIlnRAS0pSFumO4qJeEepJlctwCuVmFV6tBWp1evYhuN7GE4nNeUtbOKImF5BFASO+n0WjUWisHLqCD5bjUXm6AS67X8OiD0RDJOl4wjUZVas12t1BqNJqEmUzLKtPkx5CLOhEGiqgudRc5nS05D8Zn0VxtOg0+nbDy7z3ovaV-YY7ABrAh+EBwLBkIz2WZcJzanRm-OPnMGhnSx9E5AD9ALH0AlKEwRCFXw1GPSUnjJWU8CpbAIEcOME2HZNRzTRk3wtFZQCKYwTg8LwLn0esfUMTk-EaTxTBMXcsVKBDOylM8UNwNCMKwockxTMcJ0IrNiJURATGsT1Tn5aD9CONRgnXL050sMsvUgkRoNsDihi45CIz4zCbzvcEHxpekCMWcTWRIlxPE9Uoi2g0Cvx6EC8QMfQF30XwNBEItIP00MKEwCAABswAYKY0kEXVaQZV9bKnHN+U5NQfXcTwRRgywCp0AI+VC08Iui2LUhmdNoXfbMHJrExOSA8g8zzMwiwrLojFKriYwAN0VSKIsq6Z0hsmE7KtNpOVOTcRFLctDCsHRLCucICVwdC4CUCVOJGScPwa2oDgAWlRcxzGCU5Dy0Ix-F6pCZUO+rJMOLROS8HkspCawnU8Tp8X6DsDKent5UvGMoBeiS1mUj1yl83cnTLO63UFVrSw6O7MVaIHCRBsLuOM9CDlSo63v8VEqgXH0l1plb6N3chpNMYU2m0IV8b20H4nKsAYfst6RWZoxNB0PwD08PFOW8OsIP8oUfX5YxHr53BBuGiBBenDTGgrZ0bGow8CvXHTyF9EJ7uuAU2w2oA */
  createMachine(
    {
      tsTypes: {} as import("./sectionEditor.machine.typegen").Typegen0,
      schema: {
        context: {} as {
          id: string;
          level: 1 | 2 | 3 | 4 | 5 | 6;
          heading: string;
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
              value: string;
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
                    target: "#sectionEditor.focus",
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
          heading: (_context, event) => event.value,
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
          return context.heading.length <= 0 && context.body === 0;
        },
        editorHeadingHasNoContent: (context) => {
          return context.heading.length <= 0;
        },
        editorBodyHasNoContent: (context) => {
          return context.body === 0;
        },
      },
    }
  );

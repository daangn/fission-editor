/* @eslint-disable */

import { spawn, createMachine, type Sender, type EventFrom } from "xstate";
import { assign } from "@xstate/immer";

import {
  sectionEditorMachine,
  type SectionEditorActorRef,
} from "./sectionEditor.machine";

export type EditorManagerEventSender = Sender<
  EventFrom<typeof editorManagerMachine>
>;

export const editorManagerMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SQJYBcD2AnAsgQwDs8YsA6FCAGzAGIBBAYQBUBJANTqYFEBtABgC6iUAAcMsdCgwFhIAB6IAjABZFpZQHYAnIoBsADn1aAzPuPGArABoQATyXHlpHSotaATOb673F9wF9-G1RMXEJiMDIKanpmdk5eRSEkEDEJNCkZFIUEFTVNHQMjU3NrO0R3H3ULM3cNP0qfDUDgiHRsfCISUgAzDABjAFdYGgARLkZWDm5+ZNFxSWlZHMUtLVJdXQ99d2ULRQ19ZR8bewQd511LZXdFC1U+Pl8W8DbQzoiyPqGR8YBlJgAJQA8gBNAD6XFGLCYwMBs1kaUWWVAORq6wsukU+kUxk8imxJ3KCDq+lIGk0Ki0Bm8h0ULxCHXC3W+wxofwACnQAOoAOUh0Nh8MEiIWGSW2UQyjxpGMfDcHkxfn2ulOSk0spxWlpFg07n0GmaQVe7TCXUivQGbIAYsCGABVP4CmFwhEpJHilHyRA1JyVCxufaKXbuOpqhDKEzOXwWa6HXXGI3GggYCBwWSMs2fUXpTLLRAAWlVxKLpD4xl0e0rVw0m31FgZbyZ5qiVDAOeR+Yj7nD+uMpDcibxqkNwYCxszHxZVvg7rFeclEY0fFlxi0O1UKhuu3DifWejM9UeWz4+j4ykCgSAA */
  createMachine(
    {
      tsTypes: {} as import("./editorManager.machine.typegen").Typegen0,
      schema: {
        context: {} as {
          editors: [string, SectionEditorActorRef][];
          currentEditorId: string | null;
        },
        events: {} as
          | {
              type: "ACTIVATE";
            }
          | {
              type: "DEACTIVATE";
            }
          | {
              type: "SPAWN_EDITOR";
            }
          | {
              type: "DESTROY_EDITOR";
              id: string;
            }
          | {
              type: "FOCUS_EDITOR";
              id: string;
            },
      },
      preserveActionOrder: true,
      predictableActionArguments: true,
      id: "editorManager",
      initial: "idle",
      states: {
        idle: {
          on: {
            ACTIVATE: [
              {
                target: "focus",
                cond: "hasNoChildren",
                actions: ["spawnEditor", "activateEditor"],
              },
              {
                target: "focus",
                actions: "activateEditor",
              },
            ],
          },
        },
        focus: {
          on: {
            DEACTIVATE: {
              target: "idle",
            },
            DESTROY_EDITOR: {
              actions: "destroyEditor",
            },
            SPAWN_EDITOR: {
              actions: ["deactivateEditor", "spawnEditor", "activateEditor"],
            },
            FOCUS_EDITOR: {
              actions: "activateEditor",
            },
          },
        },
      },
    },
    {
      actions: {
        spawnEditor: assign((context) => {
          const id = Math.random().toString();
          context.editors.push([
            id,
            spawn(
              sectionEditorMachine.withContext({
                id,
                level: 1,
                heading: 0,
                body: 0,
              })
            ),
          ]);
        }),
        destroyEditor: assign((context, event) => {
          const [_id, ref] =
            context.editors.find(([id, ref]) => id === event.id) ?? [];
          ref?.stop?.();

          context.editors = context.editors.filter(([id]) => id !== event.id);
          context.currentEditorId = context.editors.at(-1)?.[0] ?? null;
        }),
        activateEditor: assign((context, event) => {
          switch (event.type) {
            case "ACTIVATE":
            case "SPAWN_EDITOR": {
              context.currentEditorId = context.editors.at(-1)?.[0] ?? null;
              break;
            }
            case "FOCUS_EDITOR": {
              context.currentEditorId = event.id;
              const [_id, ref] =
                context.editors.find(([id, ref]) => id === event.id) ?? [];
              ref?.send?.("ACTIVATE_BODY");
              break;
            }
          }
        }),
        deactivateEditor: assign((context, event) => {
          context.currentEditorId = null;
        }),
      },
      guards: {
        hasNoChildren(context, event) {
          return Object.values(context.editors).length === 0;
        },
      },
    }
  );

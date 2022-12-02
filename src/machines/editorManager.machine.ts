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
  /** @xstate-layout N4IgpgJg5mDOIC5SQJYBcD2AnAsgQwDs8YsA6FCAGzAGIBBAYQBUBJANTqYFEBtABgC6iUAAcMsdCgwFhIAB6IAjABZFAGhABPRMoDsfUnwAcATj4A2AEwBWAL62NqTLkLEwZCtXrN2nXoqEkEDEJNCkZIIUEFXUtRGsTS1JlE2tLI0UTI0tlS0Uje0cIdGx8IhJyKloAEQAlOgBxAH0uapYmAHla-kDRcUlpWSiYjW0EI2VC8GLnMrcyADMMAGMAV1gaWq4u6q5alrbO7sFZEIGI0CjcgGZSa31rxRtRnQnSXXNrBOVlbNzMqZOUquCpLNYbXaMVgcbg9U79MKDSKISzmRTJayPZ5xBCqEx3UwWGyAmbA8ruUhg9Y0XYAZSYtQ6AE0Du0unCgmdERd5DpLLc+CZrrprC8ENcjEZSBliQ5piUXOTFitqbSAAp0ADqADlWUcOX1QuEhjpHqRMpinqKcfz8aksXY5UDFfNKSqNgAxDoMACqtL17JOnIRxuRuOuSVUyiJ1rGKkmUwIGAgcFkzrmJHhRqRl0QAFpzGKCySFRmKZ4wFnzibcZYxSl8Sk8rpLDknopBQmiqWQRSqfBg9meVddOj0mYrLHEGikopRxMfn88iYS7Ne2QIFhiFAUAQoFXuTW9GPCZOxUZbo77EA */
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
            }
          | {
              type: "DRAG_EDITOR";
            }
          | {
              type: "REORDER_EDITOR";
              prevIndex: number;
              nextIndex: number;
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
            DRAG_EDITOR: {
              target: "dragging",
            },
          },
        },
        focus: {
          on: {
            REORDER_EDITOR: {
              actions: ["reorderEditor", "deactivateEditor"],
            },
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
        dragging: {},
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
        reorderEditor: assign((context, event) => {
          const editor = context.editors[event.prevIndex];
          const reorderedEditors = [...context.editors];
          reorderedEditors.splice(event.prevIndex, 1);
          reorderedEditors.splice(event.nextIndex, 0, editor);

          context.editors = reorderedEditors;
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

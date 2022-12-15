/* @eslint-disable */

import {
  spawn,
  createMachine,
  type Sender,
  type EventFrom,
  type StateFrom,
  type ContextFrom,
  type ActorRefFrom,
} from "xstate";
import { assign } from "@xstate/immer";

import {
  sectionEditorMachine,
  type SectionEditorActorRef,
} from "./sectionEditor.machine";

export type EditorManagerEventSender = Sender<
  EventFrom<typeof editorManagerMachine>
>;
export type EditorManagerActorRef = ActorRefFrom<typeof editorManagerMachine>;

export type EditorManagerState = StateFrom<typeof editorManagerMachine>;

export type EditorManagerContext = ContextFrom<typeof editorManagerMachine>;

export const editorManagerMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SQJYBcD2AnAsgQwDs8YsBiAEQFEBlAFQCUB5ATQH1LyBJWx+gbQAMAXUSgADhljoUGAqJAAPRACYALKoB0ANgAcAZgCsAdgMBOPXtMCtegDQgAnoi0BGUxr1blA1WuVGBHQEDAF8Q+1RMXEJiMDJqAAUAQQB1ADl2Lh5+YXkJKTQZOSRFFTUNA2VTHVMbF2UDHWN7JwQAWhc9CtUjHVcqly0BFyNVHTCIiHRsfCISUgAxRgBhAFVqTO5eQRES-OlZeSUEZscVAy7-IZrrKuUdXonwKajZ2KwNFAgAGzBSJOWtE4ADUkrRKDs8pIDsVQMc1C5tEZakZOupRv4WohPEYKgJlFotCYDC4asinpEZjESJ8fn8AUDQeC+C5duJoYVDiV4apEUSUWier4jFiEKorBorDV1N5Ub1QuFntNonM4hoAGYYADGAFdYBRKAyQWCIbk9hyikdsV4NJ17oEjFpfI1RXoRhoBPjCUY9D5KmowoqCBgIHB5JSVe8oQVLdzEKZRR18d1ej0DBcfZ1TBSXlTVR8vr9ozCrQgXKouiNakS9M6AgIRWcTsm9E0xp7UTogg2c8q3jTNbr4OaY1y4YhKjoNI6DF43AI3c7XYNp5UtI0zEEK9nA0A */
  createMachine(
    {
      tsTypes: {} as import("./editorManager.machine.typegen").Typegen0,
      schema: {
        context: {} as {
          editors: [string, SectionEditorActorRef][];
          currentEditorId: string | null;
          // lastModifiedEditorId가 동기화 안되는중
          lastModifiedEditorId: string | null;
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
      on: {
        DESTROY_EDITOR: {
          actions: "destroyEditor",
        },
        SPAWN_EDITOR: {
          target: ".focus",
          actions: ["deactivateEditor", "spawnEditor"],
        },
        FOCUS_EDITOR: {
          target: ".focus",
          actions: "activateEditor",
        },
      },
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
          },
        },
      },
    },
    {
      actions: {
        spawnEditor: assign((context) => {
          const id = Math.random().toString();
          const index = context.editors.findIndex(
            ([id, ref]) => id === context.currentEditorId
          );
          context.editors.splice(index + 1, 0, [
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
          context.currentEditorId = id;
        }),
        destroyEditor: assign((context, event) => {
          const [_id, ref] =
            context.editors.find(([id, ref]) => id === event.id) ?? [];
          ref?.stop?.();

          context.editors = context.editors.filter(([id]) => id !== event.id);
          // TODO: destroy하고 currentEditorId 수정
          context.currentEditorId = context.editors.at(-1)?.[0] ?? null;
        }),
        activateEditor: assign((context, event) => {
          switch (event.type) {
            case "ACTIVATE": {
              const index = context.editors.findIndex(
                ([id]) => id === context.currentEditorId
              );

              context.currentEditorId = context.editors.at(index)?.[0] ?? null;
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
          if (event.type === "SPAWN_EDITOR") {
            return;
          }

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

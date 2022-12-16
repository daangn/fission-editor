/* @eslint-disable */

import {
  spawn,
  createMachine,
  actions,
  type Sender,
  type EventFrom,
  type StateFrom,
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

export type EditorManagerContext = {
  editors: [string, SectionEditorActorRef][];
  currentEditorId: string | null;
};

export type EditorManagerEvent =
  | {
      type: "SYNC";
    }
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
    };

export const editorManagerMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SQJYBcD2AnAsgQwDs8YsBiAEQFEBlAFQCUB5ATQH1LyBJWx+gbQAMAXUSgADhljoUGAqJAAPRACYAbKoB0ADgDMATi0BWLQIEBGAOyGzAGhABPRGeUBfF3dSZchYmDLUABQBBAHUAOXYuHn5heQkpNBk5JEVEQws7RwQdAWVtQz0AFlyzPVU9PR0zNw8IdGx8IhJSADFGAGEAVWpI7l5BERT46Vl5JQR0zMRCtQ01Q1V0nS0DQ2NDGvA6r0bfMiD22k4ANSDaSgG4yRHk0HHJhycLPQ1CwyrlUwt1AUKLHU2ngaPmaByOp3OfDMg3E10SoxS430Ag0OkKVWcZR0yhmbymCDMWjyZmWMwKFUsFjUgO2wKaflI1GYYXalyGcKSY0QGI0FVUZjMCwEFhW6MM+LWhQ0FkJFhFRRyygsNPq3npWA0ADMMABjACusAolDBJzOF1i7ISnMR0wEWg06S0grJegKOPxVU0Oh0BXK5lUuhWAM2BAwEDg8iBar2VytCLuiD0+L0KLeGLMqgxykJhRVOxBfg0KAgABswLGblyJlopcKBDoA780djVB79BoBKplIZCmZcp967n3FtVbsSFrdQaK-DbqlsmZa0ZXYZu93irZHtl252133lAO0W43EA */
  createMachine(
    {
      tsTypes: {} as import("./editorManager.machine.typegen").Typegen0,
      schema: {
        context: {} as EditorManagerContext,
        events: {} as EditorManagerEvent,
      },
      preserveActionOrder: false,
      predictableActionArguments: true,
      on: {
        DESTROY_EDITOR: {
          actions: ["destroyEditor"],
        },
        SPAWN_EDITOR: {
          target: ".focus",
          actions: ["deactivateEditor", "spawnEditor"],
        },
        FOCUS_EDITOR: {
          target: ".focus",
          actions: "activateEditor",
        },
        ACTIVATE: [
          {
            target: ".focus",
            cond: "hasNoChildren",
            actions: ["spawnEditor"],
          },
          {
            target: ".focus",
            actions: "activateEditor",
          },
        ],
        SYNC: {},
      },
      id: "editorManager",
      initial: "idle",
      states: {
        idle: {},
        focus: {
          on: {
            DEACTIVATE: {
              target: "idle",
              actions: "deactivateEditor",
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
                headingElement: () => null,
                bodyElement: () => null,
              })
            ),
          ]);
          context.currentEditorId = id;
        }),
        destroyEditor: assign((context, event) => {
          const [_id, ref] =
            context.editors.find(([id, ref]) => id === event.id) ?? [];
          ref?.stop?.();

          const length = context.editors.length;
          const destroyedIndex = context.editors.findIndex(
            ([id, ref]) => id === event.id
          );

          context.editors = context.editors.filter(([id]) => id !== event.id);

          if (destroyedIndex === length - 1) {
            context.currentEditorId = context.editors.at(-1)?.[0] ?? null;
          } else {
            context.currentEditorId =
              context.editors.at(destroyedIndex)?.[0] ?? null;
          }
        }),
        activateEditor: assign((context, event) => {
          switch (event.type) {
            case "ACTIVATE": {
              if (context.currentEditorId == null) {
                const [id, ref] = context.editors[0];
                context.currentEditorId = id;
                ref.send("ACTIVATE");
              } else {
                const map = new Map(context.editors);
                const editorRef = map.get(context.currentEditorId);
                editorRef?.send("ACTIVATE");
              }
              break;
            }
            case "FOCUS_EDITOR": {
              context.currentEditorId = event.id;
              const [_id, ref] =
                context.editors.find(([id, ref]) => id === event.id) ?? [];
              ref?.send?.("ACTIVATE");
              break;
            }
          }
        }),
        deactivateEditor: (context) => {
          // const editor = context.editors.find(
          //   ([id, ref]) => id === context.currentEditorId
          // );
          // editor?.[1]?.send("DEACTIVATE");
        },
      },
      guards: {
        hasNoChildren(context, event) {
          return Object.values(context.editors).length === 0;
        },
      },
    }
  );

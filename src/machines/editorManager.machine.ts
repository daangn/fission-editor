/* @eslint-disable */

import { spawn, createMachine } from 'xstate';
import { assign } from '@xstate/immer';

import {
  sectionEditorMachine,
  type SectionEditorActorRef,
} from './sectionEditor.machine';

export const editorManagerMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SQJYBcD2AnAsgQwDs8YsA6FCAGzAGIBBAYQBUBJANTqYFEBtABgC6iUAAcMsdCgwFhIAB6IAjABZFpZQHYAnIoBsADn1aAzPuPGArABoQATyXHlpHSotaATOb673F9wF9-G1RMXEJiMDIKanpmdk5eRSEkEDEJNCkZFIUEFTVNHQMjU3NrO0R3H3ULM3cNP0qfDUDgiHRsfCISUgAzDABjAFdYGgARLkZWDm5+ZNFxSWlZHMUtLVJdXQ99d2ULRQ19ZR8bewQd511LZXdFC1U+Pl8W8DbQzoiyPqGR8YBlJgAJQA8gBNAD6XFGLCYwMBs1kaUWWVAORq6wsukU+kUxk8imxJ3KCDq+lIGk0Ki0Bm8h0ULxCHXC3W+wxofwACnQAOoAOUh0Nh8MEiIWGSW2UQyjxpGMfDcHkxfn2ulOSk0spxWlpFg07n0GmaQVe7TCXUivQGbIAYsCGABVP4CmFwhEpJHilHyRA1JyVCxufaKXbuOpqhDKEzOXwWa6HXXGI3GggYCBwWSMs2fchUMCi9KZZZS9zh-XGUhuRN41SG4MBY2Zj4sq3wd1iwuSiMaPiy4xaHaqFQ3XbhxPrPRmeqPLZ8fR8ZQMt5M81YfPIosIAC0quJ29IfFxT2U3lxjlD9MC-iAA */
  createMachine({
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
              actions: ["spawnEditor", "focusEditor"],
            },
            {
              target: "focus",
              actions: "focusEditor",
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
            actions: ["spawnEditor", "focusEditor"],
          },
          FOCUS_EDITOR: {
            actions: "focusEditor",
          },
        },
      },
    },
  }, {
    actions: {
      spawnEditor: assign(context => {
        const id = Math.random().toString();
        context.editors.push(
          [
            id,
            spawn(
              sectionEditorMachine.withContext({
                id,
                heading: '',
                body: '',
              }),
            ),
          ],
        );
      }),
      destroyEditor: assign((context, event) => {
        const [_id, ref] = context.editors.find(([id, ref]) => id === event.id) ?? [];
        ref?.stop?.();

        context.editors = context.editors.filter(([id]) => id !== event.id);
        context.currentEditorId = context.editors.at(-1)?.[0] ?? null;
      }),
      focusEditor: assign((context, event) => {
        switch (event.type) {
          case 'ACTIVATE':
          case 'SPAWN_EDITOR': {
            context.currentEditorId = context.editors.at(-1)?.[0] ?? null;
            break;
          }
          case 'FOCUS_EDITOR': {
            context.currentEditorId = event.id;
            const [_id, ref] = context.editors.find(([id, ref]) => id === event.id) ?? [];
            ref?.send?.('ACTIVATE_BODY');
            break;
          }
        }
      }),
    },
    guards: {
      hasNoChildren(context, event) {
        return Object.values(context.editors).length === 0;
      },
    },
  });

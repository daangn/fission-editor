import * as React from 'react';
import { useMachine, useActor } from '@xstate/react';

import {
  editorManagerMachine,
} from '../../machines/editorManager.machine'
import {
  type SectionEditorActorRef,
} from '../../machines/sectionEditor.machine'

export default function Demo() {
  const [current, send] = useMachine(editorManagerMachine, {
    devTools: true,
    context: {
      editors: [],
      currentEditorId: null,
    },
  });

  React.useEffect(() => {
    const editorId = current.context.currentEditorId;
    if (editorId) {
      send({ type: 'FOCUS_EDITOR', id: editorId });
    }
  }, [current.context.currentEditorId]);

  return (
    <div
      tabIndex={0}
      style={{
        width: '100vw',
        minHeight: '200px',
        border: '1px solid',
      }}
      onFocus={() => {
        send('ACTIVATE');
      }}
      onBlur={() => {
        send('DEACTIVATE');
      }}
    >
      {current.context.editors.map(([id, ref]) => (
        <DemoInput key={id} id={id} editorRef={ref} />
      ))}
    </div>
  );
}

type DemoInputProps = {
  id: string,
  editorRef: SectionEditorActorRef,
}

function DemoInput({
  id,
  editorRef,
}: DemoInputProps) {
  const [current, send] = useActor(editorRef);

  const headingRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const focusOnHeading = current.matches('focus.onHeading');
    if (focusOnHeading) {
      headingRef.current!.focus();
    }
    const focusOnBody = current.matches('focus.onBody');
    if (focusOnBody) {
      bodyRef.current!.focus();
    }
  }, [current, send]);

  return (
    <div>
      <input
        ref={headingRef}
        value={current.context.heading}
        onFocus={e => {
          send('ACTIVATE');
          send('FOCUS_HEADING');
        }}
        onChange={e => {
          send({
            type: 'CHANGE_HEADING',
            value: e.currentTarget.value,
          });
        }}
        onKeyDown={e => {
          if (e.code === 'Backspace') {
            send('INPUT_BACKSPACE');
          }
        }}
      />
      <input
        ref={bodyRef}
        value={current.context.body}
        onFocus={() => {
          send('ACTIVATE');
          send('FOCUS_BODY');
        }}
        onChange={e => {
          send({
            type: 'CHANGE_BODY',
            value: e.currentTarget.value,
          });
        }}
        onKeyDown={e => {
          if (e.code === 'Backspace') {
            send('INPUT_BACKSPACE');
          }
          if (e.code === 'Enter') {
            send('SPAWN_SIBLING');
          }
        }}
      />
    </div>
  );
}

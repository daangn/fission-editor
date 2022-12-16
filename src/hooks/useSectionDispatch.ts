import * as React from "react";
import { useActor } from "@xstate/react";

import { EditorManager } from "../context/EditorManager";

export function useSectionDispatch(sectionId: string) {
  const editorManagerRef = React.useContext(EditorManager);
  const [current, send] = useActor(editorManagerRef);

  const [id, ref] = current.context.editors.filter(
    ([id]) => id === sectionId
  )[0];

  return {
    inputBackspace: () =>
      ref.send({
        type: "INPUT_BACKSPACE",
      }),
    focusBody: () =>
      ref.send({
        type: "FOCUS_BODY",
      }),
    focusHeading: () =>
      ref.send({
        type: "FOCUS_HEADING",
      }),
    activate: () =>
      ref.send({
        type: "ACTIVATE",
      }),
    changeBody: (length: number) =>
      ref.send({
        type: "CHANGE_BODY",
        length,
      }),
    changeHeading: (value: string) =>
      ref.send({
        type: "CHANGE_HEADING",
        value,
      }),
  };
}

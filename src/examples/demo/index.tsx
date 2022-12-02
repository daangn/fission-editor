import * as React from "react";
import * as ReactDOM from "react-dom/client";

import { inspect } from "@xstate/inspect";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Demo from "./demo";

inspect({
  iframe: false,
});

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <Demo />
    </DndProvider>
  </React.StrictMode>
);

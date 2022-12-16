import * as React from "react";
import * as ReactDOM from "react-dom/client";

import { inspect } from "@xstate/inspect";

import Demo from "./demo";

inspect({
  iframe: false,
});

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Demo />
  </React.StrictMode>
);

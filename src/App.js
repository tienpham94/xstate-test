import React from "react";
import { useMachine } from "@xstate/react";
import { Machine } from "xstate";
import "./App.css";

const toggleMachine = new Machine({
  id: "toggleMachine",
  initial: "inactive",
  states: {
    inactive: {
      on: {
        TOGGLE: "active"
      }
    },
    active: {
      on: {
        TOGGLE: "inactive"
      }
    }
  }
});

function App() {
  const [current, send] = useMachine(toggleMachine);

  console.log(current);
  return (
    <div>
      <button onClick={() => send("TOGGLE")}>Toggle</button>
      {current.matches("active") ? "active" : "inactive"}
    </div>
  );
}

export default App;

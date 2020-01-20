import React from "react";
import { useMachine } from "@xstate/react";
import { Machine, assign } from "xstate";
import "./App.css";

const allData = new Array(25).fill(0).map((_val, i) => i + 1);

const perPage = 10;

const dataMachine = new Machine({
  id: "dataMachine",
  initial: "loading",
  // context: quantitative info like data
  context: {
    data: []
  },
  states: {
    loading: {
      // xState gives way to invoke a service when transition in to a state, can be callback, another machine or promise
      invoke: {
        id: "dataLoader",
        // here need to define a function
        src: (context, _event) => {
          // need to return a function, tricky!
          // callback is a way to send event backup to parent machine
          // onEvent : listen to event coming from parent
          return (callback, _onEvent) => {
            setTimeout(() => {
              const { data } = context;
              const newData = allData.slice(data.length, data.length + perPage);
              const hasMore = newData.length === perPage;

              if (hasMore) {
                callback({ type: "DONE_MORE", newData });
              } else {
                callback({ type: "DONE_COMPLETE", newData });
              }
            }, 1000);
          };
        }
      },
      // listening for events
      on: {
        // translate to the 'more' state
        // convert this string more into object
        // assign is to update data in context
        DONE_MORE: {
          target: "more",
          actions: assign({
            data: (context, event) => {
              const { newData = [] } = event;
              return [...context.data, ...newData];
            }
          })
        },
        DONE_COMPLETE: {
          target: "complete",
          actions: assign({
            data: (context, event) => {
              const { newData = [] } = event;
              return [...context.data, ...newData];
            }
          })
        },
        FAIL: "failure"
      }
    },
    more: {
      on: {
        LOAD: "loading"
      }
    },
    complete: {
      type: "final"
    },
    failure: {
      type: "final"
    }
  }
});

function App() {
  const [current, send] = useMachine(dataMachine);

  const { data } = current.context;

  return (
    <div className="App">
      <ul>
        {data.map(row => (
          <li key={row} style={{ background: "orange" }}>
            {row}
          </li>
        ))}

        {current.matches("loading") && <li>Loading...</li>}

        {current.matches("more") && (
          <button style={{ background: "green" }}>
            <button onClick={() => send('LOAD')}>Load More</button>
          </button>
        )}
      </ul>
    </div>
  );
}

export default App;

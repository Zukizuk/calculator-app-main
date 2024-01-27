import { useReducer } from "react";
import "./App.scss";
import Digitbtn from "./components/Digitbtn";
import OperationButton from "./components/OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};
const initialState = {
  currentOperand: "0",
  previousOperand: null,
  operation: null,
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand === null && state.previousOperand == null)
        return state;
      if (state.currentOperand === "0" && state.previousOperand == null)
        return state;
      if (state.currentOperand == null)
        return {
          ...state,
          operation: payload.operation,
        };
      if (state.previousOperand == null)
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
        };
      return {
        ...state,
        previousOperand: state.currentOperand,
      };
  }
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  return (
    <>
      <main>
        <h1 className="sr-only">Calculator App</h1>
        <div className="top">
          <h2>calc</h2>
          <div className="head">
            THEME
            <div>
              <span>123</span>
              <button></button>
            </div>
          </div>
        </div>
        <div className="mid">
          <output>{currentOperand}</output>
        </div>
        <div className="buttons">
          <Digitbtn digit="7" dispatch={dispatch} />
          <Digitbtn digit="8" dispatch={dispatch} />
          <Digitbtn digit="9" dispatch={dispatch} />
          <button
            className="NaN clean"
            onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
          >
            DEL
          </button>
          <Digitbtn digit="4" dispatch={dispatch} />
          <Digitbtn digit="5" dispatch={dispatch} />
          <Digitbtn digit="6" dispatch={dispatch} />
          <OperationButton operation="+" dispatch={dispatch} />
          <Digitbtn digit="1" dispatch={dispatch} />
          <Digitbtn digit="2" dispatch={dispatch} />
          <Digitbtn digit="3" dispatch={dispatch} />
          <OperationButton operation="-" dispatch={dispatch} />
          <Digitbtn digit="." dispatch={dispatch} />
          <Digitbtn digit="0" dispatch={dispatch} />
          <OperationButton operation="/" dispatch={dispatch} />
          <OperationButton operation="x" dispatch={dispatch} />
          <button
            className="span-two NaN clean"
            onClick={() => dispatch({ type: ACTIONS.CLEAR })}
          >
            RESET
          </button>
          <button
            onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
            className="span-two NaN evaluate"
          >
            =
          </button>
        </div>
      </main>
    </>
  );
}

export default App;

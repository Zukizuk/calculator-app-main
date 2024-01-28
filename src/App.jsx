import { useEffect, useReducer, useState } from "react";
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
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };
  }
}
function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "x":
      computation = prev * current;
      break;
    case "/":
      computation = prev / current;
      break;
  }

  return computation.toString();
}
const Theme = {
  one: "",
  two: "theme-two",
  three: "theme-three",
};
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  const [theme, setTheme] = useState(Theme.one);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      switch (prevTheme) {
        case Theme.one:
          return Theme.two;
        case Theme.two:
          return Theme.three;
        default:
          return Theme.one;
      }
    });
  };
  console.log(previousOperand);
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
              <button
                aria-label="toggle theme button"
                onClick={toggleTheme}
                className={theme}
              ></button>
            </div>
          </div>
        </div>
        <div className="mid">
          <output>{formatOperand(currentOperand)}</output>
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

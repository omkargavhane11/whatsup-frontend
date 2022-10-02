import { useReducer } from "react";
import { createContext } from "react";

export const ThemeContext = createContext();

const INITIAL_STATE = { user: null };

const userReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return { user: action.payload };
        case "LOGOUT":
            return { user: null };
        default:
            return state;
    }
}

export const ThemeProvider = (props) => {
    const [state, dispatch] = useReducer(userReducer, INITIAL_STATE);

    return (
        <ThemeContext.Provider value={{ state, dispatch }}>
            {props.children}
        </ThemeContext.Provider>
    )
}
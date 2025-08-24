import { createContext } from "react";

const MyContext = createContext("");

function MyProvider({ children }) {
    return (
        <MyContext.Provider value={{}}>
            {children}
        </MyContext.Provider>
    );
}

export { MyContext, MyProvider };
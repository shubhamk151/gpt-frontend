import "./App.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";

import React from 'react';


import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from "./AuthPage/Login.jsx";
import ProtectedRoute from "./AuthPage/ProtectedRoute.jsx";
import Signup from "./AuthPage/Signup.jsx";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setcurrThreadId] = useState(uuidv1());
  const [previousChats, setPreviousChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setcurrThreadId,
    previousChats,
    setPreviousChats,
    newChat,
    setNewChat,
    allThreads,
    setAllThreads,
  };

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MyContext.Provider value={providerValues}>
                  <Sidebar />
                  <ChatWindow />
                </MyContext.Provider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;




// return (
//     <div className="app">
//       <MyContext.Provider value={providerValues}>
//         <Sidebar />
//         <ChatWindow />
//       </MyContext.Provider>
//     </div>
//   );

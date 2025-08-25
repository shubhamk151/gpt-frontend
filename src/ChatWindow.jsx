import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, use } from "react";
import { SyncLoader } from "react-spinners";
import React from 'react';


function ChatWindow() {
  const { prompt, setPrompt, reply, setReply, currThreadId, setPreviousChats, setNewChat, previousChats } =
    useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getReply = async () => {
    setLoading(true);
    setNewChat(false);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ` + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch("http://localhost:8080/api/chat", options);
      const data = await response.json();
      setReply(data.reply);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  //appends new chats to previousChats
  useEffect(() => {
    if (prompt && reply) {
      setPreviousChats((prevChats) => [
        ...prevChats,
        { role: "user", content: prompt },
        { role: "assistant", content: reply },
      ]);
    }
    setPrompt("");
  }, [reply]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.reload();
  }

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          TigerGPT &nbsp; <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>

      {
        isOpen &&
        <div className="dropDown">
          <div className="dropDownItem"><i className="fa-solid fa-user"></i>Hi, { localStorage.getItem("username")}</div>
          <div className="dropDownItem"><i class="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
          <div className="dropDownItem logout" onClick={handleLogout}><i class="fa-solid fa-arrow-right-from-bracket "></i> Log out</div>
        </div>
      }

      <Chat />
      <SyncLoader color="#09fa46ff" loading={loading} />

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
          ></input>
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          SigmaGPT can make mistakes. Please verify the information provided.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;

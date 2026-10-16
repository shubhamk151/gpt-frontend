import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import { HashLoader } from "react-spinners";
import React from "react";

// const baseURL = "http://localhost:8080";
const baseURL = "https://gpt-backend-ot06.onrender.com";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    newChat,
    setPreviousChats,
    setNewChat,
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const profileRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const getReply = async () => {
    setLoading(true);
    setNewChat(false);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };
    try {
      const link = `${baseURL}/api/chat`;
      const response = await fetch(link, options);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          alert("Session expired. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          window.location.href = "/login";
          return;
        }
        const error = await response.json();
        alert(error.error || "Failed to get response");
        return;
      }

      const data = await response.json();
      setReply(data.reply);
    } catch (err) {
      console.error(err);
      alert("Network error. Please check your connection.");
    }
    setLoading(false);
  };

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

  useEffect(() => {
    if (newChat) {
      inputRef.current?.focus();
    }
  }, [newChat, currThreadId]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isOpen &&
        !profileRef.current?.contains(event.target) &&
        !dropdownRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.reload();
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          TigerGPT &nbsp; <i className="fa-solid fa-chevron-down"></i>
        </span>

        <div
          ref={profileRef}
          className="userProfile"
          onClick={handleProfileClick}
        >
          <i className="fa-solid fa-user"></i>
          <div className="username">
            <p>
              {localStorage
                .getItem("username")
                ?.split(" ")[0]
                .replace(/^./, (letter) => letter.toUpperCase())}
            </p>
            <p>User</p>
          </div>
        </div>
      </div>

      {isOpen && (
        <div ref={dropdownRef} className="dropDown">
          <div className="dropDownItem">
            <i className="fa-solid fa-user"></i>
            {localStorage.getItem("username")?.split(" ")[0]}
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan
          </div>
          <div className="dropDownItem logout" onClick={handleLogout}>
            <i className="fa-solid fa-arrow-right-from-bracket "></i> Log out
          </div>
        </div>
      )}

      <Chat />
      <HashLoader color="#22d3ee" size={38} loading={loading} />

      <div className={`chatInput ${newChat ? "new-chat-input" : ""}`}>
        <div className="inputBox">
          <input
            ref={inputRef}
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
          TigerGPT can make mistakes. Please verify the information provided.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;

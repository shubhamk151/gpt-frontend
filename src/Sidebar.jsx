import React from "react";
import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

// const baseURL = "https://gpt-backend-ot06.onrender.com";
const baseURL = "http://localhost:8080";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setcurrThreadId,
    setPreviousChats,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const link = `${baseURL}/api/thread`;
      const response = await fetch(link, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          window.location.href = "/login";
          return;
        }
        console.error("Failed to fetch threads");
        return;
      }

      const res = await response.json();
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filteredData);
    } catch (err) {
      console.error(err);
      alert("Failed to load threads. Please refresh the page.");
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setcurrThreadId(uuidv1());
    setPreviousChats([]);
  };

  const changeThread = async (newThreadId) => {
    setcurrThreadId(newThreadId);

    try {
      const link = `${baseURL}/api/thread/${newThreadId}`;
      const response = await fetch(link, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          window.location.href = "/login";
          return;
        }
        if (response.status === 404) {
          alert("Thread not found or access denied");
          return;
        }
        console.error("Failed to load thread");
        return;
      }

      const res = await response.json();
      setPreviousChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.error(err);
      alert("Failed to load thread. Please try again.");
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(`${baseURL}/api/thread/${threadId}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      await response.json();

      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="sidebar">
      <button onClick={createNewChat} className="new-chat-button">
        <i className="fa-brands fa-asymmetrik logo"></i>
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li
            key={idx}
            onClick={() => changeThread(thread.threadId)}
            className={thread.threadId === currThreadId ? "highlighted" : " "}
          >
            {thread.title}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      <div className="sign">
        <p>
          By shubham{" "}
          <span>
            <i className="fa-solid fa-heart"></i>
          </span>{" "}
          2025
        </p>
      </div>
    </section>
  );
}

export default Sidebar;

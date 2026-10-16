import React from "react";
import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

const baseURL = "https://gpt-backend-ot06.onrender.com";
// const baseURL = "http://localhost:8080";

function Sidebar() {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPlacement, setMenuPlacement] = useState("down");
  const [pinnedThreadIds, setPinnedThreadIds] = useState([]);
  const [pendingDeleteThread, setPendingDeleteThread] = useState(null);
  const [pendingRenameThread, setPendingRenameThread] = useState(null);
  const [renameTitle, setRenameTitle] = useState("");

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
    setOpenMenuId(null);
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setcurrThreadId(uuidv1());
    setPreviousChats([]);
  };

  const changeThread = async (newThreadId) => {
    setOpenMenuId(null);
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

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          window.location.href = "/login";
          return;
        }
        if (response.status === 404) {
          alert("Thread not found or already deleted");
          return;
        }
        alert("Failed to delete thread");
        return;
      }

      await response.json();

      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId),
      );
      setPinnedThreadIds((prev) => prev.filter((id) => id !== threadId));
      setOpenMenuId(null);

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete thread. Please try again.");
    }
  };

  const requestDeleteThread = (thread) => {
    setOpenMenuId(null);
    setPendingDeleteThread(thread);
  };

  const confirmDeleteThread = async () => {
    if (!pendingDeleteThread) return;

    const threadId = pendingDeleteThread.threadId;
    setPendingDeleteThread(null);
    await deleteThread(threadId);
  };

  const requestRenameThread = (thread) => {
    setOpenMenuId(null);
    setPendingRenameThread(thread);
    setRenameTitle(thread.title);
  };

  const confirmRenameThread = () => {
    const title = renameTitle.trim();

    if (!pendingRenameThread || !title) return;

    setAllThreads((prev) =>
      prev.map((thread) =>
        thread.threadId === pendingRenameThread.threadId
          ? { ...thread, title }
          : thread,
      ),
    );
    setPendingRenameThread(null);
    setRenameTitle("");
  };

  const togglePinThread = (threadId) => {
    setPinnedThreadIds((prev) =>
      prev.includes(threadId)
        ? prev.filter((id) => id !== threadId)
        : [...prev, threadId],
    );
    setOpenMenuId(null);
  };

  const shareThread = async (threadId) => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}?thread=${threadId}`,
      );
      alert("Chat link copied");
    } catch (err) {
      console.error(err);
      alert("Unable to copy chat link");
    }
    setOpenMenuId(null);
  };

  return (
    <section className="sidebar">
      <button onClick={createNewChat} className="new-chat-button">
        <i className="fa-brands fa-asymmetrik logo"></i>
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      <div className="recent-chats">Recent Chats...</div>

      <ul className="history">
        {allThreads
          ?.slice()
          .sort(
            (first, second) =>
              Number(pinnedThreadIds.includes(second.threadId)) -
              Number(pinnedThreadIds.includes(first.threadId)),
          )
          .map((thread) => (
            <li
              key={thread.threadId}
              onClick={() => changeThread(thread.threadId)}
              className={thread.threadId === currThreadId ? "highlighted" : " "}
            >
              {thread.title.length > 25
                ? `${thread.title.slice(0, 22)}...`
                : thread.title}
              {pinnedThreadIds.includes(thread.threadId) && (
                <i
                  className="fa-solid fa-thumbtack pinned-thread-icon"
                  aria-label="Pinned chat"
                ></i>
              )}
              <button
                type="button"
                className="thread-menu-button"
                aria-label={`Actions for ${thread.title}`}
                onClick={(e) => {
                  e.stopPropagation();

                  const clickedButton = e.currentTarget;
                  const history = clickedButton.closest(".history");
                  const buttonBounds = clickedButton.getBoundingClientRect();
                  const historyBounds = history?.getBoundingClientRect();
                  const menuHeight = 180;
                  const shouldOpenUp =
                    historyBounds &&
                    buttonBounds.bottom + menuHeight > historyBounds.bottom &&
                    buttonBounds.top - menuHeight > historyBounds.top;

                  setMenuPlacement(shouldOpenUp ? "up" : "down");
                  setOpenMenuId((currentId) => {
                    return currentId === thread.threadId
                      ? null
                      : thread.threadId;
                  });
                }}
              >
                <i className="fa-solid fa-ellipsis"></i>
              </button>
              {openMenuId === thread.threadId && (
                <div
                  className={`thread-menu thread-menu-${menuPlacement}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => requestRenameThread(thread)}
                  >
                    <i className="fa-solid fa-pen"></i>
                    Rename
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePinThread(thread.threadId)}
                  >
                    <i className="fa-solid fa-thumbtack"></i>
                    {pinnedThreadIds.includes(thread.threadId)
                      ? "Unpin"
                      : "Pin"}
                  </button>
                  <button
                    type="button"
                    onClick={() => shareThread(thread.threadId)}
                  >
                    <i className="fa-solid fa-share-nodes"></i>
                    Share
                  </button>
                  <button
                    type="button"
                    className="delete-action"
                    onClick={() => requestDeleteThread(thread)}
                  >
                    <i className="fa-solid fa-trash"></i>
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
      </ul>

      <div className="sign">
        <p>
          Made with Shubham &nbsp;
          {new Date().getFullYear()}
        </p>
      </div>

      {pendingDeleteThread && (
        <div
          className="delete-modal-backdrop"
          role="presentation"
          onClick={() => setPendingDeleteThread(null)}
        >
          <div
            className="delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="delete-modal-title">Delete chat?</h2>
            <p>
              “{pendingDeleteThread.title}” will be permanently deleted. This
              action cannot be undone.
            </p>
            <div className="delete-modal-actions">
              <button
                type="button"
                className="cancel-delete-button"
                onClick={() => setPendingDeleteThread(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="confirm-delete-button"
                onClick={confirmDeleteThread}
              >
                Delete chat
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingRenameThread && (
        <div
          className="rename-modal-backdrop"
          role="presentation"
          onClick={() => setPendingRenameThread(null)}
        >
          <div
            className="rename-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rename-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="rename-modal-title">Rename chat</h2>
            <label htmlFor="rename-chat-input">Chat title</label>
            <input
              id="rename-chat-input"
              value={renameTitle}
              onChange={(event) => setRenameTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") confirmRenameThread();
                if (event.key === "Escape") setPendingRenameThread(null);
              }}
              autoFocus
            />
            <div className="rename-modal-actions">
              <button
                type="button"
                className="cancel-rename-button"
                onClick={() => setPendingRenameThread(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="confirm-rename-button"
                onClick={confirmRenameThread}
                disabled={!renameTitle.trim()}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Sidebar;

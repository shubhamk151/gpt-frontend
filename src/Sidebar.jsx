import React from 'react';
import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
function Sidebar() {
    const { allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setcurrThreadId, setPreviousChats } = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread", {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            });
            const res = await response.json();
            const filteredData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
            // console.log(filteredData);
            setAllThreads(filteredData);
            ;
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId])

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setcurrThreadId(uuidv1());
        setPreviousChats([]);
    }

    const changeThread = async (newThreadId) => {
        setcurrThreadId(newThreadId);

        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
            const res = await response.json();
            setPreviousChats(res);
            setNewChat(false);
            setReply(null);

        } catch (err) {
            console.log(err);
        }
    }

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, { method: "DELETE" });
            const res = await response.json();
            console.log(res);

            //updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if (threadId === currThreadId) {
                createNewChat();
            }

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <section className="sidebar">

            <button onClick={createNewChat} className="new-chat-button">
                {/* <img src="/src/assets/blacklogo.png" className='logo' alt="gpt logo" /> */}
                <i className="fa-brands fa-asymmetrik logo"></i>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            <ul className='history'>
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx} onClick={() => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted" : " "}
                        >{thread.title}
                            <i className="fa-solid fa-trash" onClick={(e) => {
                                e.stopPropagation();
                                // Add your delete logic here
                                deleteThread(thread.threadId);
                            }}></i></li>
                    ))
                }
            </ul>

            <div className='sign'>
                <p>By shubham <span><i className="fa-solid fa-heart"></i></span> 2025</p>
            </div>
        </section>
    );
}


export default Sidebar;
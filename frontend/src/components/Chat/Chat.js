import React, { useEffect, useRef, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import styles from "./styles.module.css";
import SendIcon from "../../images/direct.png";
import BackIcon from "../../images/back.png";

export default function Chat({ socket, username }) {

  const [messages, setMessages] = useState([]);
  const [color, setColor] = useState("");
  const { room } = useParams();
  const history = useHistory();
  const inputRef = useRef();
  const messageRef = useRef();


  useEffect(() => {

    socket.on("message", (message) => {
      setMessages(state => state.concat({
        ...message
      }));
    });

    socket.on("color", (color) => {
      setColor(color);
    })

    return () => {
      console.log("running cleanup!");
      socket.off("message");
      socket.off("color");
      socket.emit("leave room", {
        username,
        room
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages])

  function scrollToBottom() {
    messageRef.current.scrollIntoView({ behavior: "smooth" });
  }

  function sendMessage() {

    const content = inputRef.current.value;

    if (content) {
      socket.emit("send message", {
        room,
        username,
        content
      })

      setMessages(state => state.concat({
        username,
        content,
        isMe: true,
        isInfo: false,
        color
      }));

      inputRef.current.value = "";
    }

  }


  return (
    <div className={styles.container}>
      <div className={styles.headingContainer}>
        <img onClick={() => history.goBack()} className={styles.icon} src={BackIcon} alt="back-icon" />
        <h1 className={styles.heading}>{room}</h1>
      </div>

      <div className={styles.messageContainer}>
        {
          messages.map(({ username, content, isMe, isInfo , color}, index) => {
            const userClass = isMe ? styles.me : styles.other;

            return (
              <div key={index} className={`${styles.message} ${userClass}`}>
                <p className={styles.messageUsername} style={{ color }}>
                  {
                    isInfo ? content : username
                  }
                </p>
                { !isInfo && <p className={styles.messageContent}>{content}</p> }
              </div>
            )
          })
        }
        <div ref={messageRef}></div>
      </div>
      <div className={styles.inputContainer}>
        <input ref={inputRef} className={styles.input} type="text" />
        <div onClick={sendMessage}>
          <img className={styles.icon} src={SendIcon} alt="send-icon" />
        </div>
      </div>
    </div>
  )
}

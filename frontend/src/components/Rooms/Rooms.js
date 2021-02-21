import React from "react";
import { useHistory } from "react-router-dom";
import styles from "./styles.module.css";

export default function Option({ username, socket, availableRooms }) {

  const history = useHistory();

  function createRoom() {
    const room = prompt("Enter room name");

    if (room) {

      if (availableRooms.includes(room)) {
        alert("Room with the same name already exists!");
      } else {
        socket.emit("create room", room);
        history.push(`/rooms/${room}`);
      }
      
    }

  }

  function joinRoom(room) {
    socket.emit("join room", {
      room,
      username
    });

    history.push(`/rooms/${room}`);
  }

  return (
    <div>
      <h1 className={styles.heading}>react-chat</h1>
      <div className={styles.btnContainer}>
        <ul>
          {
            availableRooms.map(
              room => (
                <li onClick={() => joinRoom(room)} className={styles.room} key={room}>{room}</li>
              )
            )
          }
        </ul>
        <button onClick={createRoom} className={styles.btn}>Create room</button>
      </div>
    </div>
  )
}

import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Switch, Route, Redirect } from "react-router-dom";
import Entry from "./components/Entry/Entry";
import Rooms from "./components/Rooms/Rooms";
import Chat from "./components/Chat/Chat";

export default function App() {

  const [username, setUsername] = useState("");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketTemp = io();

    socketTemp.on("available rooms", (rooms) => {
      setAvailableRooms(rooms);
    })

    setSocket(socketTemp);

    return () => socketTemp.disconnect();
  }, []);

  return (
    <Switch>
      <Route exact path="/">
        {
          username ?
            <Rooms username={username} socket={socket} availableRooms={availableRooms}/> :
            <Entry setUsername={setUsername} />
        }
      </Route>
      <Route exact path="/rooms">
        {
          username ?
            <Rooms username={username} socket={socket} availableRooms={availableRooms} /> :
            <Redirect to="/" />
        }
      </Route>
      <Route path="/rooms/:room">
        <Chat socket={socket} username={username} />
      </Route>
    </Switch>
  )
}
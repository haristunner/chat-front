import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Socket, io } from "socket.io-client";

const socket = io.connect("http://localhost:8000");

export const Chat = () => {
  const [message, setMessage] = useState("");
  const [recepient, setRecepient] = useState([]);
  const [receiver, setReceiver] = useState({});
  const username = useSelector((state) => state.user.userName);

  console.log(username);

  useEffect(() => {
    //first it sends the username to the addUser event
    socket.emit("addUser", {
      username,
    });

    //to get all online users
    socket.on("getUsers", (users) => {
      // console.log(users);
      setRecepient(users);
    });

    //this event -> listens any message is coming or not
    socket.on("send", ({ sender, message }) => {
      console.log("messssing", message);
    });

    //clean up all the listeners
    return () => {
      socket.off("addUser");
      socket.off("getUsers");
      socket.off("send");
    };
  }, []);

  // const receiver = recepient.filter((user) => user.userId !== username);
  // console.log(receiver);
  console.log(receiver);

  useEffect(() => {
    const fetchChat = async () => {
      if (receiver !== undefined) {
        await axios
          .get("http://localhost:8000/chat", {
            params: {
              sender: username,
              receiver: receiver.userId,
            },
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    };

    fetchChat();
  }, [receiver]);

  const send = async () => {
    socket.emit("send", {
      sender: username,
      receiver,
      message,
    });

    await axios
      .post("http://localhost:8000/chat", {
        sender: username,
        receiver: receiver.userId,
        message,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });

    setMessage("");
  };
  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />
      {recepient.map((user, index) => {
        //when this clicks -> setting who is the receiver
        return (
          <div key={index} onClick={() => setReceiver(user)}>
            {user.userId}
          </div>
        );
      })}
      <button onClick={send}>send</button>
    </div>
  );
};

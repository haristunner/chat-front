import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { Nav } from "../../components/Nav/Nav";
import "./Chat.css";
import { Button, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

//connecting socket client to server
const socket = io.connect("http://localhost:8000");

export const Chat = () => {
  const [message, setMessage] = useState("");
  const [recepient, setRecepient] = useState([]);
  const [receiver, setReceiver] = useState({});
  const [messages, setMessages] = useState([]);

  const [bool, setBool] = useState(true);

  const username = useSelector((state) => state.user.userName);

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
      setBool(!bool);
    });

    //clean up all the listeners
    return () => {
      socket.off("addUser");
      socket.off("getUsers");
      socket.off("send");
    };
  });

  // const receiver = recepient.filter((user) => user.userId !== username);
  // console.log(receiver);


 
  //*** When axios method is in top of setMessages, messages are not updated  */
  const sendMessage = async (e) => {
    e.preventDefault();
    //emit-> send message to receiver
    socket.emit("send", {
      sender: username,
      receiver,
      message,
    });


    //Currently sent message is not retrieved from db, so setting it in the client itself
    setMessages([
      ...messages,
      { message, sender: username, receiver: receiver.userId },
    ]);

    setMessage("");

    //store the messages in db
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
  };

  useEffect(() => {
    //to fetch messages from db
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
            setMessages(res.data);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    };

    fetchChat();
  }, [receiver.userId, bool]);

  window.receiver = receiver;
  window.messages = messages;

  return (
    <div>
      <Nav />
      <div className="chat__container">
        <div className="recepients">
          {recepient.map((user, index) => {
            //when this clicks -> setting who is the receiver
            return (
              <div key={index} onClick={() => setReceiver(user)}>
                {user.userId}
              </div>
            );
          })}
        </div>
        <div className="chat__screen">
          <div>
            {messages.map((message) => {
              return (
                <p
                  className={
                    message.sender === username ? "our_msg" : "receiver_msg"
                  }
                >
                  {message.message}
                </p>
              );
            })}
          </div>
          <form onSubmit={sendMessage}>
            <TextField
              placeholder="Enter the message"
              size="small"
              style={{ width: "55vw" }}
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <Button
              variant="contained"
              type="submit"
              endIcon={<SendIcon />}
              style={{ width: "10vw" }}
            >
              send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

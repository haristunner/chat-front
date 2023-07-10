import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { Nav } from "../../components/Nav/Nav";
import "./Chat.css";
import { Button, TextField } from "@mui/material";
import styled from "styled-components";
import svg from "../../assets/chat.svg";

//connecting socket client to server
const socket = io.connect("http://localhost:8000");

const MessageInput = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#fff",
      opacity: "0.5",
    },
    "&:hover fieldset": {
      borderColor: "#fff",
      opacity: "1",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#fff",
      opacity: "1",
    },
  },
});

export const Chat = () => {
  const [message, setMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [receiver, setReceiver] = useState("");
  const [messages, setMessages] = useState([]);
  const [recepients, setRecepients] = useState([]);

  const [bool, setBool] = useState(true);

  const username = useSelector((state) => state.user.userName);

  useEffect(() => {
    //first it sends the username to the addUser event
    socket.emit("addUser", {
      username,
    });

    //to get all online users
    socket.on("getUsers", (users) => {
      //user -> get users online expect ours
      const user = users.filter((u) => u.userId !== username);

      // console.log(user,users);
      setOnlineUsers(user);
    });

    //this event -> listens any message is coming or not
    socket.on("send", ({ sender, message }) => {
      console.log("messssing", message, receiver, sender);

      setMessages([...messages, { message, sender, receiver: username }]);
    });

    //clean up all the listeners
    return () => {
      socket.off("addUser");
      socket.off("getUsers");
      socket.off("send");
    };
  });

  //to get user array whom,
  useEffect(() => {
    const fetchUser = async () => {
      await axios
        .get("http://localhost:8000/users", {
          params: {
            sender: username,
          },
        })
        .then((res) => {
          setRecepients(res.data);
          console.log(res, "response of users");
        })
        .catch((err) => {
          console.error(err);
        });
    };

    fetchUser();
  }, [receiver]);

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
      { message, sender: username, receiver: receiver },
    ]);

    setMessage("");

    //store the messages in db
    await axios
      .post("http://localhost:8000/chat", {
        sender: username,
        receiver: receiver,
        message,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const mess = useMemo(() => {
    return messages;
  }, [messages]);

  useEffect(() => {
    //to fetch messages from db
    const fetchChat = async () => {
      if (receiver !== undefined) {
        await axios
          .get("http://localhost:8000/chat", {
            params: {
              sender: username,
              receiver: receiver,
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
  }, [receiver]);

  window.receiver = receiver;
  window.messages = messages;
  window.onlineUsers = onlineUsers;

  return (
    <div>
      <Nav />
      <div className="chat__container">
        <div className="recepients">
          {/* <div className="online_users">
            {onlineUsers.length ? (
              onlineUsers.map((user, index) => {
                return <div>{user.userId}</div>;
              })
            ) : (
              <p>No Online Users</p>
            )}
          </div> */}
          <div className="chatted__users">
            {recepients.map((user, index) => {
              //when this clicks -> setting who is the receiver
              return (
                <div
                  className={receiver === user ? `chatted__user` : ""}
                  key={index}
                  onClick={() => setReceiver(user)}
                >
                  {user}
                </div>
              );
            })}
          </div>
        </div>
        {receiver ? (
          <div className="chat__screen">
            <div className="chat__nav">
              <p>{receiver}</p>
            </div>

            <div>
              {messages.map((message, index) => {
                return (
                  <p
                    key={index}
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
              <MessageInput
                placeholder="Enter the message"
                size="small"
                fullWidth
                type="text"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
            </form>
          </div>
        ) : (
          <div className="chat__screen_">
            <img src={svg} alt="" style={{ height: "40vh" }} />
            <p>
              Send and Receive messages between your friends
              <p>Only when they are Online</p>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

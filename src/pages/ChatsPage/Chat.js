import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { Nav } from "../../components/Nav/Nav";
import "./Chat.css";
import { Button, TextField } from "@mui/material";
import styled from "styled-components";
import svg from "../../assets/chat.svg";
import { OnlineUsers } from "../../components/OnlineUsers/OnlineUsers";
import LockIcon from "@mui/icons-material/Lock";

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

  const username = useSelector((state) => state.user.userName);

  const messageRef = useRef(null);

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

  //scrollIntoView -> by default, our messages are mapped and the first message will be displayed first and
  //latest messages are in bottom, if we want to see that ,we need to scroll
  //for this, we are taking the reference of the div(messages bottom empty div)
  //this scrollIntoView helps to see that div, so the messages will always in bottom
  const scrollToBottom = () => {
    messageRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, receiver]);

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
          //receiver is clicked from online users or in recepients,
          //pushing receiver in response
          if (receiver) {
            const add = res.data.push(receiver);
          }
          if (res.data.length) {
            //to remove duplicates
            //indexOf -> returns first occurence of value
            //so, if already there means, index will not be equal
            const tempRecepients = res.data.filter(
              (item, index) => res.data.indexOf(item) === index
            );
            setRecepients([tempRecepients]);
            console.log(tempRecepients, "temp", res.data);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    };

    fetchUser();
  }, [receiver, username, messages]);

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

  const handleReceiver = (rec) => {
    setReceiver(rec);
  };

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
  }, [receiver, username]);

  //remove in production
  window.receiver = receiver;
  window.messages = messages;
  window.onlineUsers = onlineUsers;
  window.recepients = recepients;

  return (
    <div>
      <Nav />
      <div className="chat__container">
        <div className="recepients">
          <div className="chatted__users">
            {recepients[0]?.map((user, index) => {
              //when this clicks -> setting who is the receiver
              return (
                <div
                  className={receiver === user ? `chatted__user` : ""}
                  key={index}
                  onClick={() => handleReceiver(user)}
                >
                  {user}
                  {/* {messages[messages.length - 1]?.message} */}
                </div>
              );
            })}
          </div>

          <OnlineUsers
            onlineUsers={onlineUsers}
            handleReceiver={handleReceiver}
          />
        </div>

        {receiver ? (
          <div className="chat__screen">
            <div className="chat__nav">
              <p>{receiver}</p>
            </div>

            <div className="messages">
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
            <div ref={messageRef}></div>

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
            <p style={{ width: "35%" }}>
              Send and Receive messages between your friends to visually
              communicate.
            </p>
            <div
              style={{
                display: "flex",
                position: "absolute",
                bottom: "2vh",
                opacity: "0.4",
              }}
            >
              <LockIcon />
              End-to-end encrypted
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

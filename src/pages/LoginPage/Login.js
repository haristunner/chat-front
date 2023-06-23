import React, { useState } from "react";
import "./Login.css";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { set_username } from "../../features/UserSlice";

export const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // console.log(props.socket, "props");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submit = async (e) => {
    e.preventDefault();

    const result = await axios.post("http://localhost:8000/login", {
      email,
      password,
    });

    // const room = uuidv4();

    // const join = props.socket.emit("join_room", { email, room });
    // console.log(join, room);

    if (result.data.message === "matched") {
      // window.localStorage.setItem("username", result.data.username);
      dispatch(set_username(result.data.username));
      navigate("/chat");
    }

    console.log(result);
  };

  return (
    <div className="login">
      <form onSubmit={submit}>
        <input
          type="text"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

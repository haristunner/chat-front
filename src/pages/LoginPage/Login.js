import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import styled from "styled-components";

import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { set_username } from "../../features/UserSlice";
import svg from "../../assets/video-chat.png";

const InputField = styled(TextField)({
  //label stylings
  "& label": {
    color: "#5e4ea9",
    opacity: "0.5",
  },
  "& label.Mui-focused": {
    color: "#5e4ea9",
    opacity: "1",
  },

  //input outline stylings
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#5e4ea9",
      opacity: "0.5",
    },
    "&:hover fieldset": {
      borderColor: "#5e4ea9",
      opacity: "1",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#5e4ea9",
      opacity: "1",
    },
  },
});

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submit = async (e) => {
    e.preventDefault();

    const result = await axios.post("http://localhost:8000/login", {
      email,
      password,
    });

    if (result.data.message === "matched") {
      // window.localStorage.setItem("username", result.data.username);
      dispatch(set_username(result.data.username));
      navigate("/chat");
    }

    console.log(result);
  };

  return (
    <div className="login">
      <div className="login__left">
        <h1>Visualizee</h1>
        <img src={svg} alt="" />
      </div>
      <div className="login__container">
        <h3>LOGIN TO VISUALLY COMMUNICATE</h3>
        <form onSubmit={submit}>
          <div className="login__form">
            <InputField
              label="Enter your Email"
              variant="outlined"
              type="text"
              style={{ borderColor: "#fff" }}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
              label="Enter your Password"
              variant="outlined"
              type="password"
              style={{ borderColor: "#fff" }}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: "#5e4ea9" }}
              onClick={submit}
            >
              Submit
            </Button>
            <div>
              <span>New user to chat? continue</span>
              <button
                onClick={() => {
                  navigate("/");
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  textDecoration: "underline",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Register
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

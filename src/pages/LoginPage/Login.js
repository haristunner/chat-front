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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

    const result = await axios
      .post("http://localhost:8000/login", {
        email,
        password,
      })
      .then((res) => {
        if (res.data.message === "matched") {
          dispatch(set_username(res.data.username));
          toast.success("Welcome to Visually communicate", {
            autoClose: 3000,
          });
          setTimeout(() => {
            navigate("/chat");
          }, 1000);
        } else if (res.data.message === "no") {
          toast.error("Please check your email or password", {
            autoClose: 3000,
          });
        } else {
          toast.error("Unknown error occured");
        }
        console.log(res);
      })
      .catch((err) => {
        if (err.message === "Network Error") {
          toast.error("Please check your internet", {
            autoClose: 3000,
          });
        }
      });

    // console.log(result);
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
            <ToastContainer />
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

import React, { useState } from "react";
import "./Register.css";
import axios from "axios";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import styled from "styled-components";
import svg from "../../assets/virtual-class.png";
import { useNavigate } from "react-router-dom";

const InputField = styled(TextField)({
  //label stylings
  "& label": {
    color: "#14daa1",
    opacity: "0.5",
  },
  "& label.Mui-focused": {
    color: "#14daa1",
    opacity: "1",
  },

  //input outline stylings
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#14daa1",
      opacity: "0.5",
    },
    "&:hover fieldset": {
      borderColor: "#14daa1",
      opacity: "1",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#14daa1",
      opacity: "1",
    },
  },
});

export const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    const result = await axios.post("http://localhost:8000/register", {
      email,
      username,
      password,
    });

    console.log(result.data.message);
  };

  return (
    <div className="register">
      <div className="register__left">
        <h1>Visualizee</h1>
        <img src={svg} alt="svg" />
      </div>
      <div className="register__container">
        <h3>Register to Visually Communicate</h3>
        <form onSubmit={submit}>
          <div className="register__input">
            <InputField
              label="Enter your Email"
              variant="outlined"
              style={{ borderColor: "#fff" }}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
              label="Enter your username"
              variant="outlined"
              style={{ borderColor: "#fff" }}
              onChange={(e) => setUsername(e.target.value)}
            />
            <InputField
              label="Enter your password"
              variant="outlined"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: "#14daa1" }}
            >
              Submit
            </Button>

            <div>
              <span>
                Already Have a Account? continue
                <button
                  onClick={() => {
                    navigate("/login");
                  }}
                  style={{
                    border: "none",
                    background: "transparent",
                    textDecoration: "underline",
                    fontWeight:"600",
                    cursor:"pointer"
                  }}
                >
                  Login
                </button>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

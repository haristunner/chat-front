import React, { useState } from "react";
import "./Register.css";
import axios from "axios";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import styled from "styled-components";

const InputField = styled(TextField)({
  //label stylings
  "& label": {
    color: "#fff",
  },
  "& label.Mui-focused": {
    color: "#7efc99",
  },

  //input outline stylings
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#fff",
    },
    "&:hover fieldset": {
      borderColor: "#f9f9f9",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#14A44D",
    },
  },
});

export const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
      <h1>Visualizee</h1>
      <div className="blob"></div>
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
              style={{ backgroundColor: "#41c267" }}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

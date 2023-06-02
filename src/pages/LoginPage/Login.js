import React, { useState } from "react";
import "./Login.css";
import axios from "axios";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    const result = await axios.post("http://localhost:8000/login", {
      email,
      password,
    });

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

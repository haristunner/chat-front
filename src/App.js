import React from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { Login } from "./pages/LoginPage/Login";
import { Register } from "./pages/RegisterPage/Register";
import { Chat } from "./pages/ChatsPage/Chat";
import { useSelector } from "react-redux";

function App() {
  const loginState = useSelector((state) => state.user.loginState);

  console.log(loginState);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {loginState ? <Route path="/chat" element={<Chat />} /> : null}
      </Routes>
    </div>
  );
}

export default App;

import React from "react";
import "./Nav.css";
import logo from "../../assets/icons8-chat-64.png";
import { useSelector } from "react-redux";
import { Logout } from "../Logout/Logout";

export const Nav = () => {
  const userName = useSelector((state) => state.user.userName);
  return (
    <div className="nav">
      <nav>
        <div className="nav__logo">
          <img src={logo} alt="logo" style={{ height: "4vh" }} />
          <h5>Visualizeee</h5>
        </div>
        <div className="nav__user">
          <p>
            Hello{" "}
            <span style={{ fontWeight: "600", textTransform: "uppercase" }}>
              " {userName} "
            </span>
          </p>
          <Logout />
        </div>
      </nav>
    </div>
  );
};

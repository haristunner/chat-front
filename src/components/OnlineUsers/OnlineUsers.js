import React, { useState } from "react";
import "./OnlineUsers.css";
import { Badge } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

export const OnlineUsers = ({ onlineUsers, handleReceiver }) => {
  const [users, setUsers] = useState(false);
  return (
    <div className="online__users">
      <div className="users">
        {users ? (
          onlineUsers.length ? (
            onlineUsers.map((user, index) => {
              return (
                <div key={index} onClick={() => handleReceiver(user.userId)}>
                  {user.userId}
                </div>
              );
            })
          ) : (
            <p>No Online Users</p>
          )
        ) : (
          ""
        )}
      </div>
      <div
        className="floating-btn"
        onClick={() => {
          setUsers(!users);
        }}
      >
        <Badge variant="dot" color="success">
          <ChatIcon style={{ color: "#e28743" }} />
        </Badge>
        Online users
      </div>
    </div>
  );
};

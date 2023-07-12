import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

import { useDispatch } from "react-redux";
import { set_loginState } from "../../features/UserSlice";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    toast.success("Successfully Logged out!!", {
      autoClose: 3000,
      position: "bottom-center",
    });

    setTimeout(() => {
      dispatch(set_loginState(false));

      navigate("/");
    }, 3000);
  };
  return (
    <div className="logout">
      <Tooltip title="Logout">
        <IconButton onClick={logout}>
          <LogoutIcon style={{ color: "#ff5f56" }} />
        </IconButton>
      </Tooltip>
      <ToastContainer />
    </div>
  );
};

import React, { useState } from "react";
import axios from "axios";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import styled from "styled-components";
import svg from "../../assets/virtual-class.png";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

//ITS importmant to import tostify css first and then our css,
//so that only our custom css will work
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";

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

  const [files, setFile] = useState([]);

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (!email.length) {
      toast.error("Please enter the email", {
        autoClose: 3000,
      });

      return;
    } else if (username.length === 0) {
      toast.error("Please enter username", {
        autoClose: 3000,
      });

      return;
    } else if (password.length < 6) {
      toast.error("Password should be atleast 6 characters", {
        autoClose: 3000,
      });

      return;
    } else {
      const result = await axios
        .post("https://visualizee.onrender.com//register", {
          email,
          username,
          password,
        })
        .then((res) => {
          if (res.data.message === "Already registered") {
            toast.error("Already registered", {
              autoClose: 3000,
            });
          } else if (res.data.message === "Data saved successfully") {
            toast.success("Successfully registered, Now you can login to Chat");
            setTimeout(() => {
              navigate("/login");
            }, 3000);
          } else {
            toast.error("An error occured", {
              autoClose: 3000,
            });
          }
          console.log(res.data.message);
        })
        .catch((err) => {
          if (err.message === "Network Error") {
            toast.error("Please check your internet", {
              autoClose: 3000,
            });
          }
          console.log(err);
        });
     
    }
  };

  return (
    <div className="register">
      <div className="register__left">
        <h1>Visualizeee</h1>
        <img src={svg} alt="svg" />
      </div>
      <div className="register__container">
        <h3>Register to Visually Communicate</h3>
        <form onSubmit={submit} encType="multipart/form-data">
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
            <ToastContainer toastClassName="custom__toast-container" />
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
                    fontWeight: "600",
                    cursor: "pointer",
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

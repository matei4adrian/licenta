import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { BACKEND_URL } from "../../config";

export const Context = createContext({});
const UserContext = (props) => {
  const [userData, setUserData] = useState({
    isLoggedIn: false,
    userId: -1,
    email: "",
    nume: "",
    prenume: "",
    username: "",
  });
  const [loading, setLoading] = useState(true);

  const checkLoggedIn = async () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      const userId = localStorage.getItem("userId");
      const email = localStorage.getItem("email");
      const nume = localStorage.getItem("nume");
      const prenume = localStorage.getItem("prenume");
      const username = localStorage.getItem("username");
      setUserData({
        isLoggedIn: true,
        userId,
        email,
        nume,
        prenume,
        username,
      });
    } else {
      await axios
        .get(BACKEND_URL + "/api/auth/getUser", { withCredentials: true })
        .then((res) => {
          if (res.data) {
            setUserData({
              isLoggedIn: true,
              userId: res.data.id,
              email: res.data.email,
              nume: res.data.nume,
              prenume: res.data.prenume,
              username: res.data.username,
            });
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("userId", res.data.id);
            localStorage.setItem("email", res.data.email);
            localStorage.setItem("nume", res.data.nume);
            localStorage.setItem("prenume", res.data.prenume);
            localStorage.setItem("username", res.data.username);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setLoading(false);
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);

  return loading ? (
    <CircularProgress />
  ) : (
    <Context.Provider value={userData}>{props.children}</Context.Provider>
  );
};

export default UserContext;

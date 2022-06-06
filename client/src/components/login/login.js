import * as React from "react";
import { useLocation } from "react-router-dom";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";
import "./login.scss";
import { BACKEND_URL } from "../../config";
import Message from "../message/message";

const Login = () => {
  const search = useLocation().search;
  const logout = new URLSearchParams(search).get("logout");
  const fail = new URLSearchParams(search).get("fail");
  const handleLogin = () => {
    window.location = `${BACKEND_URL}/api/auth/google`;
  };

  return (
    <>
      <Typography variant="h3" className="login-title">
        Autentificare administrator
      </Typography>
      <div>
        <Button
          size="large"
          variant="contained"
          startIcon={<GoogleIcon />}
          onClick={handleLogin}
        >
          Autentificare cu Google
        </Button>
      </div>
      {!!fail && <Message severity="error" message="Autentificare esuata!" />}
      {!!logout && (
        <Message severity="info" message="V-ati delogat cu succes!" />
      )}
    </>
  );
};

export default Login;

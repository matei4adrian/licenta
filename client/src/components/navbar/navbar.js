import { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";
import "./navbar.scss";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ErrorIcon from "@mui/icons-material/Error";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ColorModeContext from "../contexts/color-mode-context";
import useMediaQuery from "@mui/material/useMediaQuery";
import DrawerComponent from "../drawer/drawer-component";
import AccountMenu from "../account-menu";
import { Context } from "../contexts/user-context";
import BasicModalWithoutButtons from "../basic-modal/basic-modal-without-buttons";
import { BACKEND_URL } from "../../config";
import axios from "axios";
import FeedbackForm from "../forms/feedback-form";
import Message from "../message/message";

const Navbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const user = useContext(Context);
  const { isLoggedIn } = user;
  const [openAddFeedbackModal, setOpenAddFeedbackModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleCloseAddFeedbackModal = () => {
    setOpenAddFeedbackModal(false);
  };

  const handleAddFeedback = async (values) => {
    if (successMessage) {
      setSuccessMessage("");
    }
    await axios
      .post(BACKEND_URL + "/api/feedbacks/", values, {
        withCredentials: true,
      })
      .then(() => {
        handleCloseAddFeedbackModal();
        setSuccessMessage("Feedback trimis cu succes");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <AppBar position="static">
      <CssBaseline />
      <Toolbar>
        <Typography variant="h4" className="navbar-logo">
          <Link to="/orar" className="navbar-title-link">
            Orar App
          </Link>
        </Typography>
        {!isMobile && (
          <div className="navbar-navlinks">
            <Link to="/orar" className="navbar-link">
              Orar
            </Link>
            <Link to="/administrare" className="navbar-link">
              Administrare
            </Link>
            <Link to="/vouchers" className="navbar-link">
              Vouchers
            </Link>
          </div>
        )}
        <Typography variant="h4" className="navbar-icons">
          {isLoggedIn && <AccountMenu />}
          <Tooltip title="Feedback">
            <IconButton
              sx={{ color: "white" }}
              aria-label="add feedback"
              size="large"
              onClick={() => setOpenAddFeedbackModal(true)}
            >
              <ErrorIcon />
            </IconButton>
          </Tooltip>
          <IconButton
            sx={{ padding: "10px" }}
            onClick={colorMode.toggleColorMode}
            color="inherit"
          >
            {theme.palette.mode === "dark" ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>

          {isMobile && <DrawerComponent />}
        </Typography>
      </Toolbar>
      <BasicModalWithoutButtons
        open={openAddFeedbackModal}
        onClose={handleCloseAddFeedbackModal}
        title="Trimite feedback general"
        subTitle="Completati campurile obligatorii"
        content={
          <FeedbackForm
            onSubmit={handleAddFeedback}
            onClose={handleCloseAddFeedbackModal}
            submitText="Trimite"
            subiectText="General"
          />
        }
      />
      {!!successMessage && (
        <Message severity="success" message={successMessage} />
      )}
    </AppBar>
  );
};
export default Navbar;

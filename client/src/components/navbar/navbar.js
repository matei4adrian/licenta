import { useContext } from "react";
import { AppBar, Toolbar, CssBaseline, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import "./navbar.scss";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ColorModeContext from "../contexts/color-mode-context";
import useMediaQuery from "@mui/material/useMediaQuery";
import DrawerComponent from "../drawer/drawer-component";
import AccountMenu from "../account-menu";
import { Context } from "../contexts/user-context";

const Navbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const user = useContext(Context);
  const { isLoggedIn } = user;

  return (
    <AppBar position="static">
      <CssBaseline />
      <Toolbar>
        <Typography variant="h4" className="navbar-logo">
          <Link to="/orar" className="navbar-titleLink">
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
          <IconButton
            sx={{ ml: 1 }}
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
    </AppBar>
  );
};
export default Navbar;

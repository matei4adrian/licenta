import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { paperClasses } from "@mui/material/Paper";
import "./drawer-component.scss";

const DrawerComponent = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const theme = useTheme();

  return (
    <>
      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        sx={{
          [`& .${paperClasses.root}`]: {
            backgroundColor: theme.palette.mode === "light" ? "#1976d2" : "",
          },
        }}
      >
        <List>
          <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <Link to="/orar" className="drawer-link">
                Orar
              </Link>
            </ListItemText>
          </ListItem>
          <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <Link to="/administrare" className="drawer-link">
                Administrare
              </Link>
            </ListItemText>
          </ListItem>
          <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <Link to="/vouchers" className="drawer-link">
                Vouchers
              </Link>
            </ListItemText>
          </ListItem>
        </List>
      </Drawer>
      <IconButton
        onClick={() => setOpenDrawer(!openDrawer)}
        sx={{ ml: 1 }}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
    </>
  );
};

export default DrawerComponent;

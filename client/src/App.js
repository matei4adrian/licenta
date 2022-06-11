import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { blue } from "@mui/material/colors";
import Navbar from "./components/navbar/navbar";
import OrarPage from "./pages/orar/orar-page";
import AdministrarePage from "./pages/administrare/administrare-page";
import VouchersPage from "./pages/vouchers/vouchers-page";
import ColorModeContext from "./components/contexts/color-mode-context";
import UserContext from "./components/contexts/user-context";
import MateriiPage from "./pages/materii/materii-page";
import ProfesoriPage from "./pages/profesori/profesori-page";
import SaliPage from "./pages/sali/sali-page";

const getDesignTokens = (mode) => ({
  typography: {
    button: {
      textTransform: "none",
    },
  },
  palette: {
    mode,
    ...(mode === "light"
      ? {
          background: {
            default: blue[50],
          },
        }
      : {
          primary: blue,
          background: {
            default: "#081933",
            paper: "#1e3554",
          },
          text: {
            primary: "#fff",
          },
        }),
  },
});

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const interfaceTheme = localStorage.getItem("theme");
  const systemTheme = prefersDarkMode ? "dark" : "light";
  const [mode, setMode] = useState(
    interfaceTheme ? interfaceTheme : systemTheme
  );
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  const OrarRoutes = () =>
    useRoutes([
      { path: "/", element: <OrarPage /> },
      { path: "/orar", element: <OrarPage /> },
      { path: "/administrare", element: <AdministrarePage /> },
      { path: "/vouchers", element: <VouchersPage /> },
      { path: "/materii", element: <MateriiPage /> },
      { path: "/profesori", element: <ProfesoriPage /> },
      { path: "/sali", element: <SaliPage /> },
    ]);

  return (
    <div className="app-container">
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <Router>
            <UserContext>
              <Navbar />
              <OrarRoutes />
            </UserContext>
          </Router>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </div>
  );
}

export default App;

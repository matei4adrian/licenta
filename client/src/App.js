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
import MateriiPage from "./pages/materii-page";
import ProfesoriPage from "./pages/profesori-page";
import SaliPage from "./pages/sali-page";
import SeriiPage from "./pages/serii-page";
import GrupePage from "./pages/grupe-page";
import FeedbacksPage from "./pages/feedbacks/feedbacks-page";
import AdministratoriPage from "./pages/administratori-page";
import StatisticiPage from "./pages/statistici-page/statistici-page";

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
      { path: "/serii", element: <SeriiPage /> },
      { path: "/grupe", element: <GrupePage /> },
      { path: "/feedbacks", element: <FeedbacksPage /> },
      { path: "/administratori", element: <AdministratoriPage /> },
      { path: "/statistici", element: <StatisticiPage /> },
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

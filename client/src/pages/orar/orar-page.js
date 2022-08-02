import React, { useContext, useEffect, useState } from "react";
import Orar from "../../components/orar/orar";
import "./orar-page.scss";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { Context } from "../../components/contexts/user-context";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Facultati from "../../components/facultati-step/facultati";
import Filters from "../../components/filters/filters";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { Checkbox, CircularProgress, FormControlLabel } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Message from "../../components/message/message";

const steps = ["Selectează facultatea", "Alege filtrul"];

const zileCalendar = {
  MO: "Luni",
  TU: "Marti",
  WE: "Miercuri",
  TH: "Joi",
  FR: "Vineri",
  SA: "Sambata",
};

const zileCalendarNumerotate = {
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6,
};

const OrarPage = () => {
  const favTip = localStorage.getItem("favTip");
  const favOption = localStorage.getItem("favOption");
  const favFacultateId = localStorage.getItem("favFacultateId");
  const user = useContext(Context);
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [facultateId, setFacultateId] = useState(
    favFacultateId ? favFacultateId : -1
  );
  const [activitati, setActivitati] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tip, setTip] = useState(favTip ? favTip : "");
  const [option, setOption] = useState(favOption ? favOption : "");
  const [openAddOraModal, setOpenAddOraModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [favCheckboxValue, setFavCheckboxValue] = useState(
    favOption ? !!favOption : false
  );
  const [triggerRender, setTriggerRender] = useState(false);

  const handleNext = () => {
    let newSkipped = skipped;

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    removeFav();
    setAppointments([]);
    setActiveStep(0);
  };

  const handleChangeFilter = () => {
    removeFav();
    setAppointments([]);
    setActiveStep(1);
  };

  const handleSubmitGetOrar = async (values) => {
    setActiveStep(2);
    const { tip: tipAles, option: optionAles } = values;
    await axios
      .get(
        BACKEND_URL +
          `/api/facultati/${facultateId}/activitati?${tipAles}=${optionAles}`
      )
      .then((res) => {
        if (res.data) {
          setTip(tipAles);
          setOption(optionAles);
          setActivitati(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getOrarAtChange = async () => {
    await axios
      .get(
        BACKEND_URL +
          `/api/facultati/${facultateId}/activitati?${tip}=${option}`
      )
      .then((res) => {
        if (res.data) {
          setActivitati(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFavoriteCheckbox = (isFavorite) => {
    setFavCheckboxValue(isFavorite);
    if (isFavorite) {
      localStorage.setItem("favFacultateId", facultateId);
      localStorage.setItem("favTip", tip);
      localStorage.setItem("favOption", option);
    } else {
      localStorage.removeItem("favFacultateId");
      localStorage.removeItem("favTip");
      localStorage.removeItem("favOption");
    }
  };

  const removeFav = () => {
    if (favFacultateId && favTip && favOption) {
      setFavCheckboxValue(false);
      localStorage.removeItem("favFacultateId");
      localStorage.removeItem("favTip");
      localStorage.removeItem("favOption");
    }
  };

  const exportActivitatiToCsv = () => {
    const compareActivitati = (activitate1, activitate2) => {
      const data1 = new Date(activitate1.dataInceput);
      const data2 = new Date(activitate2.dataInceput);
      if (
        zileCalendarNumerotate[activitate1.rRule.slice(-2)] <
        zileCalendarNumerotate[activitate2.rRule.slice(-2)]
      ) {
        return -1;
      }
      if (
        zileCalendarNumerotate[activitate1.rRule.slice(-2)] >
        zileCalendarNumerotate[activitate2.rRule.slice(-2)]
      ) {
        return 1;
      }

      if (data1.getHours() < data2.getHours()) {
        return -1;
      }
      if (data1.getHours() > data2.getHours()) {
        return 1;
      }

      if (data1.getMinutes() < data2.getMinutes()) {
        return -1;
      }
      if (data1.getMinutes() > data2.getMinutes()) {
        return 1;
      }
      return 0;
    };

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "materie;zi;oraInceput;frecventa;tip;grupe;profesor;sala\n" +
      activitati
        .sort(compareActivitati)
        .map((activitate) => {
          const zi = zileCalendar[activitate.rRule.slice(-2)];
          const data = new Date(activitate.dataInceput);
          const frecventa = activitate.rRule.includes("INTERVAL=2")
            ? activitate.dataInceput.includes("2022-05-16")
              ? "Saptamana impara"
              : "Saptamana para"
            : "Saptamanal";
          const grupe = activitate.grupas.map((g) => g.numar).join(", ");

          return `${
            activitate.materie.denumire
          };${zi};${data.getHours()}:${data.getMinutes()};${frecventa};${
            activitate.tipActivitate
          };${grupe};${activitate.profesor.nume} ${
            activitate.profesor.prenume
          };${activitate.sala.numar}`;
        })
        .join("\n");

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const denumireFisier =
      tip !== "profesor"
        ? `orar-${tip}-${option}.csv`
        : `orar-${tip}-${option.substring(0, option.lastIndexOf("@"))}.csv`;
    link.setAttribute("download", denumireFisier);
    document.body.appendChild(link);

    link.click();
  };

  const getAppointments = async () => {
    const apps = await activitati.map((activitate) => {
      return {
        id: activitate.id,
        title: activitate.materie.denumire,
        startDate: activitate.dataInceput,
        endDate: activitate.dataSfarsit,
        type: activitate.tipActivitate,
        sala: activitate.sala.numar,
        profesor: `${activitate.profesor.nume} ${activitate.profesor.prenume}`,
        grupa: activitate.grupas.map((grupa) => grupa.numar).join(", "),
        rRule: activitate.rRule, //poa sa fie si din 2 in 2 sapt
      };
    });
    setAppointments(apps);
  };

  useEffect(() => {
    getAppointments();
  }, [activitati]);

  useEffect(() => {
    if (favTip && favOption && favFacultateId) {
      handleSubmitGetOrar({ tip: favTip, option: favOption });
    }
  }, []);

  return (
    <div className="orar-page">
      <Box sx={{ width: "95%" }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <div className="orar-page-container">
              <div className="orar-page-buttons-container">
                <div>
                  <Button onClick={handleReset}>Schimbă facultatea</Button>
                  <Button onClick={handleChangeFilter}>
                    Schimbă filtrul ({tip}{" "}
                    {tip !== "profesor"
                      ? option
                      : option.substring(0, option.lastIndexOf("@"))}
                    )
                  </Button>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {user.isLoggedIn && (
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setOpenAddOraModal(true)}
                    >
                      Adaugă activitate
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<FileDownloadIcon />}
                    style={{ marginRight: "10px", marginLeft: "10px" }}
                    onClick={exportActivitatiToCsv}
                  >
                    Export orar
                  </Button>
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<FavoriteBorder />}
                        checkedIcon={<Favorite />}
                        checked={favCheckboxValue}
                        value={favCheckboxValue}
                        onChange={(event, value) =>
                          handleFavoriteCheckbox(value)
                        }
                      />
                    }
                  />
                </div>
              </div>
              <div className="orar-page-content">
                {loading ? (
                  <div className="loading-orar-page">
                    <CircularProgress />
                  </div>
                ) : (
                  <Orar
                    appointments={appointments}
                    facultateId={facultateId}
                    openAddOraModal={openAddOraModal}
                    setOpenAddOraModal={setOpenAddOraModal}
                    setSuccessMessage={setSuccessMessage}
                    successMessage={successMessage}
                    setErrorMessage={setErrorMessage}
                    errorMessage={errorMessage}
                    getOrarAtChange={getOrarAtChange}
                    activitati={activitati}
                    triggerRender={triggerRender}
                    setTriggerRender={setTriggerRender}
                  />
                )}
                {!!successMessage && (
                  <Message severity="success" message={successMessage} />
                )}
                {!!errorMessage && (
                  <Message severity="error" message={errorMessage} />
                )}
              </div>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Înapoi
              </Button>
            </Box>
            {activeStep + 1 === 1 && (
              <Facultati
                setActiveStep={setActiveStep}
                setFacultateId={setFacultateId}
              />
            )}
            {activeStep + 1 === 2 && (
              <Filters
                onSubmit={handleSubmitGetOrar}
                facultateId={facultateId}
              />
            )}
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              {activeStep !== 0 && activeStep !== steps.length - 1 && (
                <Button onClick={handleNext}>Următorul</Button>
              )}
            </Box>
          </React.Fragment>
        )}
      </Box>
    </div>
  );
};

export default OrarPage;

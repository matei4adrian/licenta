import React, { useContext, useState } from "react";
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
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { CircularProgress } from "@mui/material";

const steps = ["Selecteaza facultatea", "Alege filtrul"];

const OrarPage = () => {
  const user = useContext(Context);
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [facultateId, setFacultateId] = useState(-1);
  const [activitati, setActivitati] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleNext = () => {
    let newSkipped = skipped;

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSubmitGetOrar = async (values) => {
    setActiveStep(2);
    const { tip, option } = values;
    await axios
      .get(
        BACKEND_URL +
          `/api/facultati/${facultateId}/activitati?${tip}=${option}`
      )
      .then((res) => {
        if (res.data) {
          setActivitati(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
                <Button onClick={handleReset}>Schimba facultatea</Button>
                {user.isLoggedIn && (
                  <Button variant="contained" startIcon={<AddIcon />}>
                    Adauga activitate
                  </Button>
                )}
              </div>
              <div className="orar-page-content">
                {loading ? (
                  <div className="loading-orar-page">
                    <CircularProgress />
                  </div>
                ) : (
                  <Orar activitati={activitati} />
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
                Inapoi
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
                <Button onClick={handleNext}>Urmatorul</Button>
              )}
            </Box>
          </React.Fragment>
        )}
      </Box>
    </div>
  );
};

export default OrarPage;

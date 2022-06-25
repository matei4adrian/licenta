import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  CircularProgress,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@mui/material";
import "./forms.scss";
import { TextField, Button, Checkbox } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { BACKEND_URL } from "../../config";

const oreFinal = {
  "7:30:00": "8:50:00",
  "9:15:00": "10:45:00",
  "11:00:00": "12:30:00",
  "12:45:00": "14:15:00",
  "14:30:00": "16:00:00",
  "16:15:00": "17:45:00",
};

const zileCalendarIdexate = {
  1: "Luni",
  2: "Marti",
  3: "Miercuri",
  4: "Joi",
  5: "Vineri",
  6: "Sambata",
};

const zileCalendar = {
  Luni: "MO",
  Marti: "TU",
  Miercuri: "WE",
  Joi: "TH",
  Vineri: "FR",
  Sambata: "SA",
};

const ActivitateForm = ({
  onClose,
  onSubmit,
  toBeEdited,
  submitText,
  facultateId,
}) => {
  const [options, setOptions] = useState([]);
  const [openGrupeAutocomplete, setOpenGrupeAutocomplete] = useState(false);
  const [openSaliAutocomplete, setOpenSaliAutocomplete] = useState(false);
  const [openMateriiAutocomplete, setOpenMateriiAutocomplete] = useState(false);
  const [openProfesoriAutocomplete, setOpenProfesoriAutocomplete] =
    useState(false);
  const [tipActiv, setTipActiv] = useState(toBeEdited ? toBeEdited.type : "");
  const [la2Sapt, setLa2Sapt] = useState(
    toBeEdited ? toBeEdited.rRule.includes("INTERVAL=2") : ""
  );
  const [materie, setMaterie] = useState(
    toBeEdited
      ? {
          name: toBeEdited.title,
          value:
            options.materii && options.materii.length > 0
              ? options.materii.filter(
                  (m) => m.denumire === toBeEdited.title
                )[0].id
              : 1,
        }
      : {}
  );
  const [loading, setLoading] = useState(true);

  const profesoriByMaterie = options.profesori
    ? options.profesori.filter(
        (profesor) =>
          profesor.materies.filter((mat) => mat.id === materie.value).length > 0
      )
    : [];

  const initialValues = toBeEdited
    ? {
        oraInceput: `${toBeEdited.startDate.getHours()}:${
          (toBeEdited.startDate.getMinutes() < 10 ? "0" : "") +
          toBeEdited.startDate.getMinutes()
        }:${
          (toBeEdited.startDate.getSeconds() < 10 ? "0" : "") +
          toBeEdited.startDate.getSeconds()
        }`,
        // zileCalendarIdexate
        ziua: zileCalendarIdexate[toBeEdited.startDate.getDay()],
        la2Sapt: toBeEdited.rRule.includes("INTERVAL=2"),
        // trebuie setata mereu sa se potriveasca cu datele setate la adaugare/editare
        parImpar: toBeEdited.rRule.includes("INTERVAL=2")
          ? toBeEdited.parentData.startDate.slice(8, 10) === "16"
            ? "impara"
            : "para"
          : "",
        tipActivitate: toBeEdited.type,
        grupe:
          toBeEdited.type === "Curs"
            ? toBeEdited.grupa.split(", ").map((grupa) => {
                return {
                  name: grupa,
                  value:
                    options.grupe && options.grupe.length > 0
                      ? options.grupe.filter(
                          (g) => g.numar === parseInt(grupa)
                        )[0].id
                      : 1,
                };
              })
            : {
                name: toBeEdited.grupa,
                value:
                  options.grupe && options.grupe.length > 0
                    ? options.grupe.filter(
                        (g) => g.numar === parseInt(toBeEdited.grupa)
                      )[0].id
                    : 1,
              },
        sala: {
          name: toBeEdited.sala,
          value:
            options.sali && options.sali.length > 0
              ? options.sali.filter((s) => s.numar === toBeEdited.sala)[0].id
              : 1,
        }, //sala
        materie: {
          name: toBeEdited.title,
          value:
            options.materii && options.materii.length > 0
              ? options.materii.filter(
                  (m) => m.denumire === toBeEdited.title
                )[0].id
              : 1,
        }, //title
        profesor: {
          name: toBeEdited.profesor,
          value:
            profesoriByMaterie && profesoriByMaterie.length > 0
              ? profesoriByMaterie.filter(
                  (p) => `${p.nume} ${p.prenume}` === toBeEdited.profesor
                )[0].id
              : 1,
        }, //profesor nume + prenume
      }
    : {
        oraInceput: "",
        ziua: "",
        la2Sapt: false,
        parImpar: "",
        tipActivitate: "",
        grupe: null,
        sala: null,
        materie: null,
        profesor: null,
      };
  const validationSchema = Yup.object().shape({
    oraInceput: Yup.string().required("Selectati ora de incepere!"),
    ziua: Yup.string().required("Selectati ziua!"),
    ...{
      ...(la2Sapt && {
        parImpar: Yup.string()
          .required("Alegeti tipul saptamanii!")
          .oneOf(
            ["para", "impara"],
            "Valoarea trebuie sa fie 'para' sau 'impara'"
          ),
      }),
    },
    tipActivitate: Yup.string()
      .required("Alegeti tipul activitatii!")
      .oneOf(
        ["Seminar", "Curs"],
        "Valoarea trebuie sa fie 'Seminar' sau 'Curs'"
      ),
    grupe:
      tipActiv === "Curs"
        ? Yup.array()
            .min(5, "Trebuie sa selectezi exact 5 grupe!")
            .max(5, "Trebuie sa selectezi exact 5 grupe!")
            .required("Selectati grupa!")
        : Yup.object().nullable().required("Selectati grupa!"),
    sala: Yup.object().nullable().required("Selectati sala!"),
    materie: Yup.object().nullable().required("Selectati materia!"),
    profesor: Yup.object().nullable().required("Selectati profesorul!"),
  });

  const getOptions = async () => {
    await axios
      .get(`${BACKEND_URL}/api/facultati/${facultateId}/activitateOptions`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data) {
          setOptions(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const selectOptions = {
    //TODO sa dea doar elemntul pe care s a facut filtrul
    grupe:
      options.grupe && options.grupe.length > 0
        ? options.grupe.map((grupa) => {
            return {
              name: grupa.numar.toString(),
              value: grupa.id,
            };
          })
        : [],
    materii:
      options.materii && options.materii.length > 0
        ? options.materii.map((materie) => {
            return {
              name: materie.denumire,
              value: materie.id,
            };
          })
        : [],
    profesori:
      profesoriByMaterie && profesoriByMaterie.length > 0
        ? profesoriByMaterie.map((profesor) => {
            return {
              name: `${profesor.nume} ${profesor.prenume}`,
              value: profesor.id,
            };
          })
        : [],
    sali:
      options.sali && options.sali.length > 0
        ? options.sali.map((sala) => {
            return {
              name: sala.numar,
              value: sala.id,
            };
          })
        : [],
  };

  useEffect(() => {
    getOptions();
  }, []);

  return (
    <Grid className="grid-form">
      {loading ? (
        <div>
          <CircularProgress />
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            const activitate = {
              //incepand cu ziua asta, saptamanal, forever
              stringDataInceput: `${
                values.parImpar === "impara" || !values.la2Sapt
                  ? "May 16, 2022"
                  : "May 23, 2022"
              } ${values.oraInceput}`,
              stringDataSfarsit: `${
                values.parImpar === "impara" || !values.la2Sapt
                  ? "May 16, 2022"
                  : "May 23, 2022"
              } ${oreFinal[values.oraInceput]}`,
              tipActivitate: values.tipActivitate,
              grupe:
                values.tipActivitate === "Curs"
                  ? values.grupe.map((grupa) => parseInt(grupa.name))
                  : [parseInt(values.grupe.name)],
              // se alege prima data ca referinta pentru saptamana para, respectiv impara, in functie de orar
              rRule: `FREQ=WEEKLY;${values.la2Sapt ? "INTERVAL=2;" : ""}BYDAY=${
                zileCalendar[values.ziua]
              }`,
              salaId: values.sala.value,
              materieId: values.materie.value,
              profesorId: values.profesor.value,
            };

            onSubmit(activitate);
          }}
        >
          {(props) => (
            <Form noValidate onSubmit={props.handleSubmit} className="form">
              <Field
                as={TextField}
                name="ziua"
                label="Ziua"
                select
                error={Boolean(props.touched.ziua && props.errors.ziua)}
                helperText={
                  <ErrorMessage name="ziua" /> &&
                  props.touched.ziua &&
                  props.errors.ziua
                }
                onBlur={props.handleBlur}
                onChange={props.handleChange}
                value={props.values.ziua}
                required
              >
                <MenuItem key={"1"} value={"Luni"}>
                  Luni
                </MenuItem>
                <MenuItem key={"2"} value={"Marti"}>
                  Marti
                </MenuItem>
                <MenuItem key={"3"} value={"Miercuri"}>
                  Miercuri
                </MenuItem>
                <MenuItem key={"4"} value={"Joi"}>
                  Joi
                </MenuItem>
                <MenuItem key={"5"} value={"Vineri"}>
                  Vineri
                </MenuItem>
                <MenuItem key={"6"} value={"Sambata"}>
                  Sambata
                </MenuItem>
              </Field>
              {!Boolean(props.touched.ziua && props.errors.ziua) ? (
                <div style={{ marginTop: "3px" }}></div>
              ) : null}
              <Field
                as={TextField}
                name="oraInceput"
                label="Ora inceput"
                select
                error={Boolean(
                  props.touched.oraInceput && props.errors.oraInceput
                )}
                helperText={
                  <ErrorMessage name="oraInceput" /> &&
                  props.touched.oraInceput &&
                  props.errors.oraInceput
                }
                onBlur={props.handleBlur}
                onChange={props.handleChange}
                value={props.values.oraInceput}
                required
              >
                <MenuItem key={"1"} value={"7:30:00"}>
                  7:30
                </MenuItem>
                <MenuItem key={"2"} value={"9:15:00"}>
                  9:15
                </MenuItem>
                <MenuItem key={"3"} value={"11:00:00"}>
                  11:00
                </MenuItem>
                <MenuItem key={"4"} value={"12:45:00"}>
                  12:45
                </MenuItem>
                <MenuItem key={"5"} value={"14:30:00"}>
                  14:30
                </MenuItem>
                <MenuItem key={"6"} value={"16:15:00"}>
                  16:15
                </MenuItem>
              </Field>
              {!Boolean(props.touched.oraInceput && props.errors.oraInceput) ? (
                <div style={{ marginTop: "3px" }}></div>
              ) : null}
              <Field
                name="la2Sapt"
                as={FormControlLabel}
                label="Activitatea are loc la 2 saptamani"
                control={
                  <Checkbox
                    checked={props.values.la2Sapt}
                    value={props.values.la2Sapt}
                    onChange={(event, newValue) => {
                      setLa2Sapt(newValue);
                      props.setFieldValue("la2Sapt", newValue);
                    }}
                  />
                }
              />
              {!Boolean(props.touched.la2Sapt && props.errors.la2Sapt) ? (
                <div style={{ marginTop: "3px" }}></div>
              ) : null}
              {props.values.la2Sapt && (
                <div>
                  <FormLabel>Tip saptamana</FormLabel>
                  <RadioGroup
                    row
                    name="parImpar"
                    value={props.values.parImpar}
                    onChange={props.handleChange}
                  >
                    <Field
                      as={FormControlLabel}
                      label="Saptamana para"
                      value="para"
                      control={<Radio />}
                    />
                    <Field
                      as={FormControlLabel}
                      label="Saptamana impara"
                      value="impara"
                      control={<Radio />}
                    />
                  </RadioGroup>
                  {props.touched.parImpar && props.errors.parImpar ? (
                    <div className="error-message">{props.errors.parImpar}</div>
                  ) : (
                    <div className="error-message">&nbsp;</div>
                  )}
                </div>
              )}
              <div>
                <FormLabel>Tip activitate *</FormLabel>
                <RadioGroup
                  row
                  name="tipActivitate"
                  value={props.values.tipActivitate}
                  onChange={(event, newValue) => {
                    if (newValue === "Curs") {
                      props.setFieldValue("grupe", []);
                    } else {
                      props.setFieldValue("grupe", null);
                    }
                    setTipActiv(newValue);
                    props.setFieldValue("tipActivitate", newValue);
                  }}
                >
                  <Field
                    as={FormControlLabel}
                    label="Curs"
                    value="Curs"
                    control={<Radio />}
                  />
                  <Field
                    as={FormControlLabel}
                    label="Seminar"
                    value="Seminar"
                    control={<Radio />}
                  />
                </RadioGroup>
                {props.touched.tipActivitate && props.errors.tipActivitate ? (
                  <div className="error-message">
                    {props.errors.tipActivitate}
                  </div>
                ) : (
                  <div className="error-message">&nbsp;</div>
                )}
              </div>
              <Autocomplete
                id="grupe"
                name="grupe"
                multiple={props.values.tipActivitate === "Curs"}
                open={openGrupeAutocomplete}
                onOpen={(event) => {
                  setOpenGrupeAutocomplete(true);
                  event.stopPropagation();
                }}
                onClose={() => {
                  setOpenGrupeAutocomplete(false);
                }}
                options={selectOptions.grupe}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                onBlur={props.handleBlur}
                onChange={(event, value) => {
                  props.setFieldValue("grupe", value);
                }}
                value={props.values.grupe}
                includeInputInList
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      props.values.tipActivitate === "Curs" ? "Grupe" : "Grupa"
                    }
                    name="grupe"
                    error={Boolean(props.touched.grupe && props.errors.grupe)}
                    onClick={(event) => event.stopPropagation()}
                    helperText={
                      <ErrorMessage name="grupe" /> &&
                      props.touched.grupe &&
                      props.errors.grupe
                    }
                    required
                  />
                )}
              />
              {!Boolean(props.touched.grupe && props.errors.grupe) ? (
                <div style={{ marginTop: "3px" }}></div>
              ) : null}
              <Autocomplete
                id="materie"
                name="materie"
                open={openMateriiAutocomplete}
                onOpen={(event) => {
                  setOpenMateriiAutocomplete(true);
                  event.stopPropagation();
                }}
                onClose={() => {
                  setOpenMateriiAutocomplete(false);
                }}
                options={selectOptions.materii}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                onBlur={props.handleBlur}
                onChange={(event, value) => {
                  setMaterie(value);
                  props.setFieldValue("materie", value);
                }}
                value={props.values.materie}
                includeInputInList
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Materie"
                    name="materie"
                    error={Boolean(
                      props.touched.materie && props.errors.materie
                    )}
                    onClick={(event) => event.stopPropagation()}
                    helperText={
                      <ErrorMessage name="materie" /> &&
                      props.touched.materie &&
                      props.errors.materie
                    }
                    required
                  />
                )}
              />
              {!Boolean(props.touched.materie && props.errors.materie) ? (
                <div style={{ marginTop: "3px" }}></div>
              ) : null}
              <Autocomplete
                id="profesor"
                name="profesor"
                open={openProfesoriAutocomplete}
                onOpen={(event) => {
                  setOpenProfesoriAutocomplete(true);
                  event.stopPropagation();
                }}
                onClose={() => {
                  setOpenProfesoriAutocomplete(false);
                }}
                options={selectOptions.profesori}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                onBlur={props.handleBlur}
                onChange={(event, value) => {
                  props.setFieldValue("profesor", value);
                }}
                value={props.values.profesor}
                includeInputInList
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Profesor"
                    name="profesor"
                    error={Boolean(
                      props.touched.profesor && props.errors.profesor
                    )}
                    onClick={(event) => event.stopPropagation()}
                    helperText={
                      <ErrorMessage name="profesor" /> &&
                      props.touched.profesor &&
                      props.errors.profesor
                    }
                    required
                  />
                )}
              />
              {!Boolean(props.touched.profesor && props.errors.profesor) ? (
                <div style={{ marginTop: "3px" }}></div>
              ) : null}
              <Autocomplete
                id="sala"
                name="sala"
                open={openSaliAutocomplete}
                onOpen={(event) => {
                  setOpenSaliAutocomplete(true);
                  event.stopPropagation();
                }}
                onClose={() => {
                  setOpenSaliAutocomplete(false);
                }}
                options={selectOptions.sali}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                onBlur={props.handleBlur}
                onChange={(event, value) => {
                  props.setFieldValue("sala", value);
                }}
                value={props.values.sala}
                includeInputInList
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sala"
                    name="sala"
                    error={Boolean(props.touched.sala && props.errors.sala)}
                    onClick={(event) => event.stopPropagation()}
                    helperText={
                      <ErrorMessage name="sala" /> &&
                      props.touched.sala &&
                      props.errors.sala
                    }
                    required
                  />
                )}
              />
              {!Boolean(props.touched.sala && props.errors.sala) ? (
                <div style={{ marginTop: "3px" }}></div>
              ) : null}

              <div className="form-buttons">
                <Button onClick={onClose}>Inchide</Button>
                <Button
                  variant="contained"
                  style={{ marginLeft: "10px" }}
                  type="submit"
                >
                  {submitText}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </Grid>
  );
};

export default ActivitateForm;

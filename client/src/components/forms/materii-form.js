import React, { useEffect, useState } from "react";
import { Autocomplete, CircularProgress, Grid } from "@mui/material";
import "./forms.scss";
import { TextField, Button } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import MenuItem from "@mui/material/MenuItem";
import { BACKEND_URL } from "../../config";
import axios from "axios";

const MateriiForm = ({ onClose, onSubmit, toBeEdited, submitText }) => {
  const initialValues = toBeEdited
    ? {
        denumire: toBeEdited.denumire,
        facultate: {
          name: toBeEdited.facultate,
          value: toBeEdited.facultateId,
        },
        semestru: toBeEdited.semestru,
        an: toBeEdited.an,
      }
    : {
        denumire: "",
        facultate: null,
        semestru: "",
        an: "",
      };
  const validationSchema = Yup.object().shape({
    denumire: Yup.string()
      .min(1, "Denumirea este prea scurtă!")
      .required("Completați denumirea!"),
    semestru: Yup.string().required("Selectați semestrul!"),
    an: Yup.number().required("Selectați anul!"),
    facultate: Yup.object().nullable().required("Selectați facultatea!"),
  });
  const [facultati, setFacultati] = useState([]);
  const [openAutocomplete, setOpenAutocomplete] = useState(false);
  const [loading, setLoading] = useState(true);

  const getFacultati = async () => {
    await axios
      .get(BACKEND_URL + "/api/facultati/", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data) {
          setFacultati(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const selectOptions =
    facultati.length > 0
      ? facultati.map((facultate) => {
          return {
            name: facultate.denumire,
            value: facultate.id,
          };
        })
      : [];

  useEffect(() => {
    getFacultati();
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
            const materie = {
              denumire: values.denumire,
              facultateId: values.facultate.value,
              semestru: values.semestru,
              an: values.an,
            };

            onSubmit(materie);
          }}
        >
          {(props) => (
            <Form noValidate onSubmit={props.handleSubmit} className="form">
              <Field
                as={TextField}
                name="denumire"
                label="Denumire"
                error={Boolean(props.touched.denumire && props.errors.denumire)}
                helperText={
                  <ErrorMessage name="denumire" /> &&
                  props.touched.denumire &&
                  props.errors.denumire
                }
                onBlur={props.handleBlur}
                onChange={props.handleChange}
                onClick={(event) => {
                  event.stopPropagation();
                }}
                type="text"
                value={props.values.denumire}
                required
              />
              {!Boolean(props.touched.denumire && props.errors.denumire) ? (
                <div style={{ marginTop: "3px" }}></div>
              ) : null}
              <Autocomplete
                id="facultate"
                name="facultate"
                open={openAutocomplete}
                onOpen={(event) => {
                  setOpenAutocomplete(true);
                  event.stopPropagation();
                }}
                onClose={() => {
                  setOpenAutocomplete(false);
                }}
                options={selectOptions}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                onBlur={props.handleBlur}
                onChange={(event, value) => {
                  props.setFieldValue("facultate", value);
                }}
                value={props.values.facultate}
                includeInputInList
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Facultatea"
                    name="facultate"
                    error={Boolean(
                      props.touched.facultate && props.errors.facultate
                    )}
                    onClick={(event) => event.stopPropagation()}
                    helperText={
                      <ErrorMessage name="facultate" /> &&
                      props.touched.facultate &&
                      props.errors.facultate
                    }
                    required
                  />
                )}
              />
              {!Boolean(props.touched.facultate && props.errors.facultate) ? (
                <div style={{ marginTop: "3px" }}></div>
              ) : null}
              <Field
                as={TextField}
                name="an"
                label="Anul"
                select
                error={Boolean(props.touched.an && props.errors.an)}
                helperText={
                  <ErrorMessage name="an" /> &&
                  props.touched.an &&
                  props.errors.an
                }
                onBlur={props.handleBlur}
                onChange={props.handleChange}
                value={props.values.an}
                required
              >
                <MenuItem key={"1"} value={"1"}>
                  1
                </MenuItem>
                <MenuItem key={"2"} value={"2"}>
                  2
                </MenuItem>
                <MenuItem key={"3"} value={"3"}>
                  3
                </MenuItem>
              </Field>
              {!Boolean(props.touched.an && props.errors.an) ? (
                <div style={{ marginTop: "3px" }}></div>
              ) : null}
              <Field
                as={TextField}
                name="semestru"
                label="Semestrul"
                select
                error={Boolean(props.touched.semestru && props.errors.semestru)}
                helperText={
                  <ErrorMessage name="semestru" /> &&
                  props.touched.semestru &&
                  props.errors.semestru
                }
                onBlur={props.handleBlur}
                onChange={props.handleChange}
                value={props.values.semestru}
                required
              >
                <MenuItem key={"1"} value={"1"}>
                  1
                </MenuItem>
                <MenuItem key={"2"} value={"2"}>
                  2
                </MenuItem>
              </Field>
              {!Boolean(props.touched.semestru && props.errors.semestru) ? (
                <div style={{ marginTop: "3px" }}></div>
              ) : null}
              <div className="form-buttons">
                <Button onClick={onClose}>Închide</Button>
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

export default MateriiForm;

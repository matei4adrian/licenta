import React, { useEffect, useState } from "react";
import { Autocomplete, CircularProgress, Grid } from "@mui/material";
import "./forms.scss";
import { TextField, Button } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { BACKEND_URL } from "../../config";

const SeriiForm = ({ onClose, onSubmit, toBeEdited, submitText }) => {
  const initialValues = toBeEdited
    ? {
        litera: toBeEdited.litera,
        limba: toBeEdited.limba,
        facultate: {
          name: toBeEdited.facultate,
          value: toBeEdited.facultateId,
        },
      }
    : {
        litera: "",
        limba: "",
        facultate: null,
      };
  const validationSchema = Yup.object().shape({
    litera: Yup.string()
      .max(1, "Litera seriei este reprezentata de un singur caracter!")
      .required("Completati litera!"),
    limba: Yup.string().required("Selectati limba!"),
    facultate: Yup.object().nullable().required("Selectati facultatea!"),
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
            const serie = {
              litera: values.litera,
              limba: values.limba,
              facultateId: values.facultate.value,
            };
            onSubmit(serie);
          }}
        >
          {(props) => (
            <Form noValidate onSubmit={props.handleSubmit} className="form">
              <Field
                as={TextField}
                name="litera"
                label="Litera"
                error={Boolean(props.touched.litera && props.errors.litera)}
                helperText={
                  <ErrorMessage name="litera" /> &&
                  props.touched.litera &&
                  props.errors.litera
                }
                onBlur={props.handleBlur}
                onChange={props.handleChange}
                onClick={(event) => {
                  event.stopPropagation();
                }}
                type="text"
                value={props.values.litera}
                required
              />
              {!Boolean(props.touched.litera && props.errors.litera) ? (
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
                name="limba"
                label="Limba"
                select
                error={Boolean(props.touched.limba && props.errors.limba)}
                helperText={
                  <ErrorMessage name="limba" /> &&
                  props.touched.limba &&
                  props.errors.limba
                }
                onBlur={props.handleBlur}
                onChange={props.handleChange}
                value={props.values.limba}
                required
              >
                <MenuItem key={"1"} value={"romana"}>
                  Romana
                </MenuItem>
                <MenuItem key={"2"} value={"engleza"}>
                  Engleza
                </MenuItem>
              </Field>
              {!Boolean(props.touched.limba && props.errors.limba) ? (
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

export default SeriiForm;

import React from "react";
import { Grid } from "@mui/material";
import "./forms.scss";
import { TextField, Button } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import MenuItem from "@mui/material/MenuItem";

const MateriiForm = ({ onClose, onSubmit, toBeEdited, submitText }) => {
  const initialValues = toBeEdited
    ? {
        denumire: toBeEdited.denumire,
        semestru: toBeEdited.semestru,
        an: toBeEdited.an,
      }
    : {
        denumire: "",
        semestru: "",
        an: "",
      };
  const validationSchema = Yup.object().shape({
    denumire: Yup.string()
      .min(1, "Denumirea este prea scurta!")
      .required("Completati denumirea!"),
    semestru: Yup.string().required("Selectati semestrul!"),
    an: Yup.number().required("Selectati anul!"),
  });

  return (
    <Grid className="grid-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
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
    </Grid>
  );
};

export default MateriiForm;

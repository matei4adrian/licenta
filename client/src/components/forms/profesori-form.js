import React from "react";
import { Grid } from "@mui/material";
import "./profesori-form.scss";
import { TextField, Button } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import MenuItem from "@mui/material/MenuItem";

const ProfesoriForm = ({ onClose, onSubmit, profesor, submitText }) => {
  const initialValues = profesor
    ? {
        nume: profesor.nume,
        prenume: profesor.prenume,
        email: profesor.email,
      }
    : {
        nume: "",
        prenume: "",
        email: "",
      };
  const validationSchema = Yup.object().shape({
    nume: Yup.string().min(2, "Nume invalid!").required("Completati numele!"),
    prenume: Yup.string()
      .min(2, "Prenume invalid!")
      .required("Completati numele!"),
    email: Yup.string()
      .email("Format email invalid!")
      .required("Completati emailul!"),
  });

  return (
    <Grid className="grid-profesori">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(props) => (
          <Form
            noValidate
            onSubmit={props.handleSubmit}
            className="profesori-form"
          >
            <Field
              as={TextField}
              name="nume"
              label="Nume"
              error={Boolean(props.touched.nume && props.errors.nume)}
              helperText={
                <ErrorMessage name="nume" /> &&
                props.touched.nume &&
                props.errors.nume
              }
              onBlur={props.handleBlur}
              onChange={props.handleChange}
              type="text"
              value={props.values.nume}
              required
            />
            {!Boolean(props.touched.nume && props.errors.nume) ? (
              <div style={{ marginTop: "3px" }}></div>
            ) : null}
            <Field
              as={TextField}
              name="prenume"
              label="Prenume"
              error={Boolean(props.touched.prenume && props.errors.prenume)}
              helperText={
                <ErrorMessage name="prenume" /> &&
                props.touched.prenume &&
                props.errors.prenume
              }
              onBlur={props.handleBlur}
              onChange={props.handleChange}
              type="text"
              value={props.values.prenume}
              required
            />
            {!Boolean(props.touched.prenume && props.errors.prenume) ? (
              <div style={{ marginTop: "3px" }}></div>
            ) : null}
            <Field
              as={TextField}
              name="email"
              label="Email"
              error={Boolean(props.touched.email && props.errors.email)}
              helperText={
                <ErrorMessage name="email" /> &&
                props.touched.email &&
                props.errors.email
              }
              onBlur={props.handleBlur}
              onChange={props.handleChange}
              type="text"
              value={props.values.email}
              required
            />
            {!Boolean(props.touched.email && props.errors.email) ? (
              <div style={{ marginTop: "3px" }}></div>
            ) : null}

            <div className="profesori-form-buttons">
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

export default ProfesoriForm;

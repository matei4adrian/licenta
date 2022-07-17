import React from "react";
import { Grid } from "@mui/material";
import "./card-form.scss";
import { TextField, Button } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const FacultateForm = ({ onClose, onSubmit, facultate, submitText }) => {
  const initialValues = facultate
    ? {
        denumire: facultate.denumire,
        fotografie: "",
      }
    : {
        denumire: "",
        fotografie: "",
      };
  const validationSchema = Yup.object().shape({
    denumire: Yup.string()
      .min(3, "Denumirea este prea scurtă!")
      .required("Completați denumirea!"),
    fotografie: !facultate
      ? Yup.mixed().required("Selectați o fotografie!")
      : null,
  });

  return (
    <Grid className="grid-card">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(props) => (
          <Form noValidate onSubmit={props.handleSubmit} className="card-form">
            <Field
              as={TextField}
              name="denumire"
              label="Denumirea"
              error={Boolean(props.touched.denumire && props.errors.denumire)}
              helperText={
                <ErrorMessage name="denumire" /> &&
                props.touched.denumire &&
                props.errors.denumire
              }
              onBlur={props.handleBlur}
              onChange={props.handleChange}
              type="text"
              value={props.values.denumire}
              required
            />
            {!Boolean(props.touched.denumire && props.errors.denumire) ? (
              <div style={{ marginTop: "3px" }}></div>
            ) : null}
            <div>
              <Field
                as="input"
                type="file"
                name="fotografie"
                label="Fotografie"
                required
                value={undefined}
                onChange={(event) => {
                  props.setFieldValue("fotografie", event.target.files[0]);
                }}
              />
              {props.touched.fotografie && props.errors.fotografie ? (
                <div className="error-message">{props.errors.fotografie}</div>
              ) : (
                <div className="error-message">&nbsp;</div>
              )}
            </div>
            <div className="card-form-buttons">
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
    </Grid>
  );
};

export default FacultateForm;

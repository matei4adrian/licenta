import React from "react";
import { Grid } from "@mui/material";
import "./forms.scss";
import { TextField, Button } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const AdministratoriForm = ({ onClose, onSubmit, submitText }) => {
  const initialValues = {
    email: "",
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Format email invalid!")
      .required("Completati emailul!"),
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
              name="email"
              label="Email administrator"
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

export default AdministratoriForm;

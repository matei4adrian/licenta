import React from "react";
import { Grid, InputLabel } from "@mui/material";
import "./forms.scss";
import { TextField, Button } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextArea from "../custom-form-fields/custom-text-field";
import RadioGroupRating from "../radio-group-rating";

const FeedbackForm = ({ onClose, onSubmit, submitText, subiectText }) => {
  const initialValues = {
    email: "",
    nume: "",
    subiect: subiectText,
    comentariu: "",
    calificativ: 0,
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Emailul trebuie sa aiba o forma valida"),
    nume: Yup.string().min(1, "Nume invalid!").required("Completati numele!"),
    subiect: Yup.string()
      .min(5, "Subiectul este vag prezentat!")
      .required("Introduceti subiectul!"),
    comentariu: Yup.string()
      .min(30, "Detalizeaza putin mai mult! (min. 30 caractere)")
      .required("Introduceti comentariul!"),
    calificativ: Yup.number()
      .oneOf([1, 2, 3, 4, 5], "Alegeti un calificativ!")
      .required("Alegeti un calificativ!"),
  });

  return (
    <Grid className="grid-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit({ ...values, calificativ: values.calificativ.toString() });
        }}
      >
        {(props) => (
          <Form noValidate onSubmit={props.handleSubmit} className="form">
            <Field
              as={TextField}
              name="email"
              label="Email (daca avem nevoie de detalii amanuntite)"
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
            />
            {!Boolean(props.touched.email && props.errors.email) ? (
              <div style={{ marginTop: "3px" }}></div>
            ) : null}
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
              name="subiect"
              label="Subiect"
              error={Boolean(props.touched.subiect && props.errors.subiect)}
              helperText={
                <ErrorMessage name="subiect" /> &&
                props.touched.subiect &&
                props.errors.subiect
              }
              onBlur={props.handleBlur}
              onChange={props.handleChange}
              type="text"
              value={props.values.subiect}
              required
            />
            {!Boolean(props.touched.subiect && props.errors.subiect) ? (
              <div style={{ marginTop: "3px" }}></div>
            ) : null}
            <Field
              as={TextArea}
              name="comentariu"
              label="Comentariu"
              error={Boolean(
                props.touched.comentariu && props.errors.comentariu
              )}
              helperText={
                <ErrorMessage name="comentariu" /> &&
                props.touched.comentariu &&
                props.errors.comentariu
              }
              onBlur={props.handleBlur}
              onChange={props.handleChange}
              value={props.values.comentariu}
              required
            />
            {!Boolean(props.touched.comentariu && props.errors.comentariu) ? (
              <div style={{ marginTop: "3px" }}></div>
            ) : null}
            <div style={{ textAlign: "center" }}>
              <InputLabel htmlFor="calificativ" style={{ textAlign: "left" }}>
                Calificativ
              </InputLabel>
              <Field
                as={RadioGroupRating}
                name="calificativ"
                value={props.values.calificativ}
                onChange={(event, value) => {
                  if (value === null) {
                    props.setFieldValue("calificativ", 0);
                  } else {
                    props.setFieldValue("calificativ", value);
                  }
                }}
              />
              {!Boolean(
                props.touched.calificativ && props.errors.calificativ
              ) ? (
                <div style={{ marginTop: "3px", height: "1.125rem" }}>
                  &nbsp;
                </div>
              ) : (
                <ErrorMessage
                  name="calificativ"
                  component="div"
                  className="error-message"
                  style={{
                    marginLeft: "14px",
                    marginRight: "0",
                    textAlign: "left",
                  }}
                />
              )}
            </div>
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

export default FeedbackForm;

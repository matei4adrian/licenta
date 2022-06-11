import React from "react";
import { Grid } from "@mui/material";
import "./sali-form.scss";
import { TextField, Button } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const SaliForm = ({ onClose, onSubmit, sala, submitText }) => {
  const initialValues = sala
    ? {
        numar: sala.numar,
      }
    : {
        numar: "",
      };
  const validationSchema = Yup.object().shape({
    numar: Yup.string().min(1, "Numar invalid!").required("Completati numar!"),
  });

  return (
    <Grid className="grid-sali">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(props) => (
          <Form noValidate onSubmit={props.handleSubmit} className="sali-form">
            <Field
              as={TextField}
              name="numar"
              label="Numar"
              error={Boolean(props.touched.numar && props.errors.numar)}
              helperText={
                <ErrorMessage name="numar" /> &&
                props.touched.numar &&
                props.errors.numar
              }
              onBlur={props.handleBlur}
              onChange={props.handleChange}
              type="text"
              value={props.values.numar}
              required
            />
            {!Boolean(props.touched.numar && props.errors.numar) ? (
              <div style={{ marginTop: "3px" }}></div>
            ) : null}

            <div className="sali-form-buttons">
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

export default SaliForm;

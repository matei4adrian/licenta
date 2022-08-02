import React from "react";
import { Grid } from "@mui/material";
import "./forms.scss";
import { TextField, Button } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const SaliForm = ({ onClose, onSubmit, toBeEdited, submitText }) => {
  const initialValues = toBeEdited
    ? {
        numar: toBeEdited.numar,
      }
    : {
        numar: "",
      };
  const validationSchema = Yup.object().shape({
    numar: Yup.string().min(1, "Număr invalid!").required("Completați numar!"),
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
              name="numar"
              label="Număr"
              error={Boolean(props.touched.numar && props.errors.numar)}
              helperText={
                <ErrorMessage name="numar" /> &&
                props.touched.numar &&
                props.errors.numar
              }
              onBlur={props.handleBlur}
              onChange={props.handleChange}
              onClick={(event) => {
                event.stopPropagation();
              }}
              type="text"
              value={props.values.numar}
              required
            />
            {!Boolean(props.touched.numar && props.errors.numar) ? (
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
    </Grid>
  );
};

export default SaliForm;

import React from "react";
import { Grid } from "@mui/material";
import "./forms.scss";
import { TextField, Button } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import MenuItem from "@mui/material/MenuItem";

const SeriiForm = ({ onClose, onSubmit, toBeEdited, submitText }) => {
  const initialValues = toBeEdited
    ? {
        litera: toBeEdited.litera,
        limba: toBeEdited.limba,
      }
    : {
        litera: "",
        limba: "",
      };
  const validationSchema = Yup.object().shape({
    litera: Yup.string()
      .max(1, "Litera seriei este reprezentata de un singur caracter!")
      .required("Completati litera!"),
    limba: Yup.string().required("Selectati limba!"),
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
              type="text"
              value={props.values.litera}
              required
            />
            {!Boolean(props.touched.litera && props.errors.litera) ? (
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
    </Grid>
  );
};

export default SeriiForm;

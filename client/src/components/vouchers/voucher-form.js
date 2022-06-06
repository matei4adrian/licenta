import React from "react";
import { Grid } from "@mui/material";
import "./voucher-form.scss";
import { TextField, Button } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextArea from "../custom-text-field";

const VoucherForm = ({ onClose, onSubmit, voucher, submitText }) => {
  const initialValues = voucher
    ? {
        compania: voucher.compania,
        descriere: voucher.descriere,
        valoare: voucher.valoare,
        fotografie: "",
      }
    : {
        compania: "",
        descriere: "",
        valoare: 1,
        fotografie: "",
      };
  const validationSchema = Yup.object().shape({
    compania: Yup.string()
      .min(3, "Numele companiei este prea scurt!")
      .required("Completati compania!"),
    descriere: Yup.string()
      .min(10, "Descrierea este prea scurta!")
      .required("Completati descrierea!"),
    valoare: Yup.number()
      .min(1, "Valoarea trebuie sa fie minim 0")
      .max(100, "Valoarea trebuie sa fie maxim 100")
      .required("Completati valoarea!"),
    fotografie: !voucher
      ? Yup.mixed().required("Selectati o fotografie!")
      : null,
  });

  return (
    <Grid className="grid-voucher">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(props) => (
          <Form
            noValidate
            onSubmit={props.handleSubmit}
            className="voucher-form"
          >
            <Field
              as={TextField}
              name="compania"
              label="Compania"
              error={Boolean(props.touched.compania && props.errors.compania)}
              helperText={
                <ErrorMessage name="compania" /> &&
                props.touched.compania &&
                props.errors.compania
              }
              onBlur={props.handleBlur}
              onChange={props.handleChange}
              type="text"
              value={props.values.compania}
              required
            />
            {!Boolean(props.touched.compania && props.errors.compania) ? (
              <div style={{ marginTop: "3px" }}></div>
            ) : null}
            <Field
              as={TextArea}
              name="descriere"
              label="Descriere"
              error={Boolean(props.touched.descriere && props.errors.descriere)}
              helperText={
                <ErrorMessage name="descriere" /> &&
                props.touched.descriere &&
                props.errors.descriere
              }
              onBlur={props.handleBlur}
              onChange={props.handleChange}
              value={props.values.descriere}
              required
            />
            {!Boolean(props.touched.descriere && props.errors.descriere) ? (
              <div style={{ marginTop: "3px" }}></div>
            ) : null}
            <Field
              as={TextField}
              name="valoare"
              label="Valoare (%)"
              error={Boolean(props.touched.valoare && props.errors.valoare)}
              helperText={
                <ErrorMessage name="valoare" /> &&
                props.touched.valoare &&
                props.errors.valoare
              }
              onBlur={props.handleBlur}
              onChange={props.handleChange}
              type="number"
              value={props.values.valoare}
              required
            />
            {!Boolean(props.touched.valoare && props.errors.valoare) ? (
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
                  console.log(event);
                  props.setFieldValue("fotografie", event.target.files[0]);
                }}
              />
              {props.touched.fotografie && props.errors.fotografie ? (
                <div className="error-message">{props.errors.fotografie}</div>
              ) : (
                <div className="error-message">&nbsp;</div>
              )}
            </div>
            <div className="voucher-form-buttons">
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

export default VoucherForm;

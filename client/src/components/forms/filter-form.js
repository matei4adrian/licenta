import React from "react";
import { Autocomplete, Grid } from "@mui/material";
import "./forms.scss";
import "./filter-form.scss";
import { TextField, Button } from "@mui/material";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const FilterForm = ({ onSubmit, tipFiltru, options, label }) => {
  const initialValues = {
    option: "",
  };
  const validationSchema = Yup.object().shape({
    option: Yup.string().required("Selectati o valoare!"),
  });

  const selectOptions =
    options && options.length > 0
      ? options.map((opt) => {
          return {
            ...(tipFiltru === "grupa" && {
              name: opt.numar.toString(),
              value: opt.numar.toString(),
            }),
            ...(tipFiltru === "materie" && {
              name: opt.denumire,
              value: opt.denumire,
            }),
            ...(tipFiltru === "profesor" && {
              name: `${opt.nume} ${opt.prenume}`,
              value: opt.email,
            }),
            ...(tipFiltru === "sala" && { name: opt.numar, value: opt.numar }),
          };
        })
      : [];

  return (
    <Grid className="grid-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit({ ...values, tip: tipFiltru });
        }}
      >
        {(props) => (
          <Form
            noValidate
            onSubmit={props.handleSubmit}
            className="filter-form"
          >
            <Autocomplete
              id="option"
              name="option"
              options={selectOptions}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              onBlur={props.handleBlur}
              onChange={(event, value) => {
                props.setFieldValue("option", value ? value.value : "");
              }}
              includeInputInList
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={label}
                  name="option"
                  error={Boolean(props.touched.option && props.errors.option)}
                  helperText={
                    <ErrorMessage name="option" /> &&
                    props.touched.option &&
                    props.errors.option
                  }
                  required
                />
              )}
            />
            {!Boolean(props.touched.option && props.errors.option) ? (
              <div style={{ marginTop: "3px", height: "19.91px" }}>&nbsp;</div>
            ) : null}
            <div className="form-buttons">
              <Button style={{ marginLeft: "10px" }} type="submit">
                Afiseaza orarul
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Grid>
  );
};

export default FilterForm;

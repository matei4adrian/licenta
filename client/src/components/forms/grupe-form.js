import React, { useEffect, useState } from "react";
import { Autocomplete, Grid } from "@mui/material";
import axios from "axios";
import "./forms.scss";
import { TextField, Button } from "@mui/material";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import { BACKEND_URL } from "../../config";

const GrupeForm = ({ onClose, onSubmit, toBeEdited, submitText }) => {
  const initialValues = toBeEdited
    ? {
        numar: toBeEdited.numar,
        serie: {
          name: `${toBeEdited.serie.litera} - ${toBeEdited.serie.limba}`,
          value: toBeEdited.serieId,
        },
      }
    : {
        numar: "",
        serie: null,
      };
  const validationSchema = Yup.object().shape({
    numar: Yup.string().required("Completati numarul grupei!"),
    serie: Yup.object().nullable().required("Selectati seria!"),
  });
  const [serii, setSerii] = useState([]);
  const [openAutocomplete, setOpenAutocomplete] = useState(false);

  const getSerii = async () => {
    await axios
      .get(BACKEND_URL + "/api/serii/", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data) {
          setSerii(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getSerii();
  }, []);

  const selectOptions =
    serii && serii.length > 0
      ? serii.map((serie) => {
          return {
            name: `${serie.litera} - ${serie.limba}, ${serie.facultate.denumire}`,
            value: serie.id,
          };
        })
      : [];

  return (
    <Grid className="grid-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const grupa = {
            numar: values.numar,
            serieId: values.serie.value,
          };
          onSubmit(grupa);
        }}
      >
        {(props) => (
          <Form noValidate onSubmit={props.handleSubmit} className="form">
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
            <Autocomplete
              id="serie"
              name="serie"
              open={openAutocomplete}
              onOpen={(event) => {
                setOpenAutocomplete(true);
                event.stopPropagation();
              }}
              onClose={() => {
                setOpenAutocomplete(false);
              }}
              options={selectOptions}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              onBlur={props.handleBlur}
              onChange={(event, value) => {
                props.setFieldValue("serie", value);
              }}
              value={props.values.serie}
              includeInputInList
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Seria"
                  name="serie"
                  error={Boolean(props.touched.serie && props.errors.serie)}
                  onClick={(event) => event.stopPropagation()}
                  helperText={
                    <ErrorMessage name="serie" /> &&
                    props.touched.serie &&
                    props.errors.serie
                  }
                  required
                />
              )}
            />
            {!Boolean(props.touched.serie && props.errors.serie) ? (
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

export default GrupeForm;

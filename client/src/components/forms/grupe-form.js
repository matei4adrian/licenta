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
        serieId: {
          name: `${toBeEdited.serie.litera} - ${toBeEdited.serie.limba}`,
          value: toBeEdited.serieId,
        },
      }
    : {
        numar: "",
        serieId: null,
      };
  const validationSchema = Yup.object().shape({
    numar: Yup.string().required("Completati numarul grupei!"),
    serieId: Yup.object().nullable().required("Selectati seria!"),
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
            name: `${serie.litera} - ${serie.limba}`,
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
            serieId: values.serieId.value,
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
              id="serieId"
              name="serieId"
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
                props.setFieldValue("serieId", value);
              }}
              value={props.values.serieId}
              includeInputInList
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Seria"
                  name="serieId"
                  error={Boolean(props.touched.serieId && props.errors.serieId)}
                  onClick={(event) => event.stopPropagation()}
                  helperText={
                    <ErrorMessage name="serieId" /> &&
                    props.touched.serieId &&
                    props.errors.serieId
                  }
                  required
                />
              )}
            />
            {!Boolean(props.touched.serieId && props.errors.serieId) ? (
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

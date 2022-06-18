import React, { useEffect, useState } from "react";
import { Autocomplete, CircularProgress, Grid } from "@mui/material";
import axios from "axios";
import "./materie-to-profesor-form.scss";
import { TextField, Button } from "@mui/material";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { BACKEND_URL } from "../../config";

const MaterieToProfesorForm = ({
  onClose,
  onSubmit,
  profesor,
  profesorToMaterieType,
  submitText,
}) => {
  const initialValues = {
    materie: "",
  };
  const validationSchema = Yup.object().shape({
    materie: Yup.string().required("Selectati materia!"),
  });
  const [materii, setMaterii] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMaterii = async () => {
    await axios
      .get(BACKEND_URL + "/api/materii/", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data) {
          const materiiNepredataDeProfesor = res.data.filter((materie) => {
            const denumiriMaterii = profesor.materies.map(
              (materie) => materie.denumire
            );
            return denumiriMaterii.indexOf(materie.denumire) < 0;
          });
          setMaterii(materiiNepredataDeProfesor);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (profesorToMaterieType === "add") {
      getMaterii();
    }
  }, []);

  const selectOptions =
    profesorToMaterieType === "delete"
      ? profesor.materies.length > 0
        ? profesor.materies.map((materie) => {
            return {
              name: materie.denumire,
              value: materie.id,
            };
          })
        : []
      : materii.length > 0
      ? materii.map((materie) => {
          return {
            name: materie.denumire,
            value: materie.id,
          };
        })
      : [];

  return (
    <Grid className="grid-materie-to-profesori">
      {loading ? (
        <div>
          <CircularProgress />
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(props) => (
            <Form
              noValidate
              onSubmit={props.handleSubmit}
              className="materie-to-profesori-form"
            >
              <Autocomplete
                id="materie"
                name="materie"
                options={selectOptions}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                style={{ width: 300 }}
                onBlur={props.handleBlur}
                onChange={(event, value) => {
                  props.setFieldValue("materie", value ? value.value : "");
                }}
                includeInputInList
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Materia"
                    error={Boolean(
                      props.touched.materie && props.errors.materie
                    )}
                    helperText={
                      <ErrorMessage name="materie" /> &&
                      props.touched.materie &&
                      props.errors.materie
                    }
                    required
                  />
                )}
              />

              {!Boolean(props.touched.materie && props.errors.materie) ? (
                <div style={{ marginTop: "3px" }}></div>
              ) : null}
              <div className="materie-to-profesori-form-buttons">
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
      )}
    </Grid>
  );
};

export default MaterieToProfesorForm;

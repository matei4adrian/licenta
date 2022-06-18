import React, { useState } from "react";
import { Grid } from "@mui/material";
import "./forms.scss";
import { TextField, Button } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  useCSVReader,
  lightenDarkenColor,
  formatFileSize,
} from "react-papaparse";

const GREY = "#CCC";
const GREY_LIGHT = "rgba(255, 255, 255, 0.4)";
const DEFAULT_REMOVE_HOVER_COLOR = "#A01919";
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(
  DEFAULT_REMOVE_HOVER_COLOR,
  40
);
const GREY_DIM = "#686868";

const styles = {
  zone: {
    alignItems: "center",
    border: `2px dashed ${GREY}`,
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    height: "140px",
    justifyContent: "center",
    padding: 20,
  },
  file: {
    background: "linear-gradient(to bottom, #EEE, #DDD)",
    borderRadius: 20,
    display: "flex",
    height: 120,
    width: 120,
    position: "relative",
    zIndex: 10,
    color: "black",
    flexDirection: "column",
    justifyContent: "center",
  },
  info: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    paddingLeft: 10,
    paddingRight: 10,
  },
  size: {
    backgroundColor: GREY_LIGHT,
    borderRadius: 3,
    marginBottom: "0.5em",
    justifyContent: "center",
    display: "flex",
  },
  name: {
    backgroundColor: GREY_LIGHT,
    borderRadius: 3,
    fontSize: 12,
    marginBottom: "0.5em",
  },
  progressBar: {
    bottom: 14,
    position: "absolute",
    width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
  },
  zoneHover: {
    borderColor: GREY_DIM,
  },
  default: {
    borderColor: GREY,
  },
  remove: {
    height: 23,
    position: "absolute",
    right: 6,
    top: 6,
    width: 23,
  },
};

const AdministratoriForm = ({
  onClose,
  onSubmitEmail,
  onSubmitUsers,
  submitText,
}) => {
  const { CSVReader } = useCSVReader();
  const [zoneHover, setZoneHover] = useState(false);
  const [removeHoverColor, setRemoveHoverColor] = useState(
    DEFAULT_REMOVE_HOVER_COLOR
  );
  const initialValues = {
    email: "",
    users: "",
  };
  const validationSchema = Yup.object().shape({
    users: Yup.array(),
    email: Yup.string()
      .email("Format email invalid!")
      .when("users", (users) => {
        return users && users.length > 0
          ? Yup.string().email("Format email invalid!")
          : Yup.string()
              .email("Format email invalid!")
              .required("Completati emailul sau adaugati un csv cu useri!");
      }),
  });

  const parseOptions = {
    header: false,
    dynamicTyping: true,
    skipEmptyLines: true,
  };

  return (
    <Grid className="grid-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          if (values.email) {
            onSubmitEmail({ email: values.email });
          } else if (values.users && !values.email) {
            onSubmitUsers({ users: values.users });
          }
        }}
      >
        {(props) => (
          <Form noValidate onSubmit={props.handleSubmit} className="form">
            <Field
              as={TextField}
              disabled={!!props.values.users}
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
              {...(!props.values.users && { required: true })}
            />
            {!Boolean(props.touched.email && props.errors.email) ? (
              <div style={{ marginTop: "3px" }}></div>
            ) : null}
            <div style={{ textAlign: "center" }}>
              <div style={{ marginBottom: "30px" }}>sau</div>
              <CSVReader
                config={parseOptions}
                disabled={!!props.values.email}
                onUploadAccepted={(results) => {
                  props.setFieldValue("users", results.data);
                  setZoneHover(false);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setZoneHover(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setZoneHover(false);
                }}
              >
                {({
                  getRootProps,
                  acceptedFile,
                  ProgressBar,
                  getRemoveFileProps,
                  Remove,
                }) => (
                  <>
                    <div
                      {...getRootProps()}
                      style={Object.assign(
                        {},
                        styles.zone,
                        zoneHover && styles.zoneHover
                      )}
                    >
                      {acceptedFile ? (
                        <>
                          <div style={styles.file}>
                            <div style={styles.info}>
                              <span style={styles.size}>
                                {formatFileSize(acceptedFile.size)}
                              </span>
                              <span style={styles.name}>
                                {acceptedFile.name}
                              </span>
                            </div>
                            <div style={styles.progressBar}>
                              <ProgressBar />
                            </div>
                            <div
                              {...getRemoveFileProps()}
                              style={styles.remove}
                              onMouseOver={(event) => {
                                event.preventDefault();
                                setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT);
                              }}
                              onMouseOut={(event) => {
                                event.preventDefault();
                                setRemoveHoverColor(DEFAULT_REMOVE_HOVER_COLOR);
                              }}
                            >
                              <div
                                onClick={() => {
                                  props.setFieldValue("users", "");
                                }}
                              >
                                <Remove color={removeHoverColor} />
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        "Introduceti un csv cu emailul administratorilor"
                      )}
                    </div>
                  </>
                )}
              </CSVReader>
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

export default AdministratoriForm;

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import "../pages.scss";
import "./feedbacks-page.scss";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Button, Tooltip } from "@mui/material";
import { Context } from "../../components/contexts/user-context";
import CustomGrid from "../../components/custom-grid";
import BasicModalWithoutButtons from "../../components/basic-modal/basic-modal-without-buttons";
import { BACKEND_URL } from "../../config";
import BasicModal from "../../components/basic-modal/basic-modal";
import Header from "../../components/administrare-child-page/header";

const FeedbacksPage = () => {
  const navigate = useNavigate();
  const user = useContext(Context);
  const { isLoggedIn } = user;
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackToBeDeleted, setFeedbackToBeDeleted] = useState({});
  const [openDeleteFeedbackModal, setOpenDeleteFeedbackModal] = useState(false);
  const [openViewFeedbackModal, setOpenViewFeedbackModal] = useState(false);
  const [feedbackToView, setFeedbackToView] = useState({});

  const isMobile = useMediaQuery({ query: `(max-width: 560px)` });

  const columns = [
    {
      field: "email",
      headerName: "Email",
      description: "Emailul celui care a dat feedback-ul",
      ...(!isMobile && { flex: 1 }),
      renderCell: (params) => (
        <Tooltip title={params.value.toString()}>
          <span>{params.value.toString()}</span>
        </Tooltip>
      ),
    },
    {
      field: "nume",
      headerName: "Nume",
      description: "Numele celui care a dat feedback-ul",
      ...(!isMobile && { flex: 1 }),
      renderCell: (params) => (
        <Tooltip title={params.value.toString()}>
          <span>{params.value.toString()}</span>
        </Tooltip>
      ),
    },
    {
      field: "subiect",
      headerName: "Subiect",
      description: "Subiectul feedback-ului",
      ...(!isMobile && { flex: 1 }),
      renderCell: (params) => (
        <Tooltip title={params.value.toString()}>
          <span>{params.value.toString()}</span>
        </Tooltip>
      ),
    },
    {
      field: "calificativ",
      headerName: "Calificativ",
      description:
        "Calificativul celui care a dat feedback-ul referitor la problema",
      ...(!isMobile && { flex: 1 }),
      renderCell: (params) => (
        <Tooltip title={params.value.toString()}>
          <span>{params.value.toString()}</span>
        </Tooltip>
      ),
    },
    {
      field: "comentariu",
      headerName: "Comentariu",
      description: "Comentariul feedback-ului",
      ...(!isMobile && { flex: 1 }),
      renderCell: (params) => (
        <Tooltip title={params.value.toString()}>
          <span>{params.value.toString()}</span>
        </Tooltip>
      ),
    },
    {
      field: "verificat",
      headerName: "Verificat",
      sortable: false,
      filterable: false,
      ...(!isMobile ? { flex: 1 } : { width: 150 }),
      renderCell: (params) => {
        const { esteVerificat, id } = params.row;

        const handleVerify = async () => {
          await axios
            .put(
              `${BACKEND_URL}/api/feedbacks/${id}`,
              { esteVerificat: !esteVerificat },
              {
                withCredentials: true,
              }
            )
            .then(() => {
              getFeedbacks();
            })
            .catch((err) => {
              console.log(err);
            });
        };

        return (
          <div>
            <IconButton
              aria-label="verify"
              color={esteVerificat ? "success" : "error"}
              onClick={handleVerify}
            >
              {esteVerificat ? (
                <CheckCircleOutlineIcon />
              ) : (
                <CancelOutlinedIcon />
              )}
            </IconButton>
          </div>
        );
      },
    },
    {
      field: "actiuni",
      headerName: "Actiuni",
      sortable: false,
      filterable: false,
      ...(!isMobile ? { flex: 1 } : { width: 150 }),
      renderCell: (params) => {
        const handleOpenViewFeedback = () => {
          setFeedbackToView(params.row);
          setOpenViewFeedbackModal(true);
        };

        const handleCloseViewFeedbackModal = () => {
          setOpenViewFeedbackModal(false);
        };

        const handleOpenDeleteFeedbackModal = () => {
          setFeedbackToBeDeleted(params.row);
          setOpenDeleteFeedbackModal(true);
        };

        const handleCloseDeleteFeedbackModal = () => {
          setOpenDeleteFeedbackModal(false);
        };

        const handleDeleteFeedback = async () => {
          await axios
            .delete(BACKEND_URL + `/api/feedbacks/${feedbackToBeDeleted.id}`, {
              withCredentials: true,
            })
            .then(() => {
              handleCloseDeleteFeedbackModal();
              getFeedbacks();
            })
            .catch((err) => {
              console.log(err);
            });
        };

        return (
          <div>
            <IconButton
              aria-label="delete"
              color="error"
              onClick={handleOpenDeleteFeedbackModal}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              aria-label="view-more"
              color="primary"
              onClick={handleOpenViewFeedback}
            >
              <VisibilityOutlinedIcon />
            </IconButton>
            <BasicModal
              open={openDeleteFeedbackModal}
              onClose={handleCloseDeleteFeedbackModal}
              title="Sterge feedback"
              onSubmit={handleDeleteFeedback}
              content={`Esti sigur ca vrei sa stergi acest feedback?`}
            />
            <BasicModalWithoutButtons
              open={openViewFeedbackModal}
              onClose={handleCloseViewFeedbackModal}
              title={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {feedbackToView.subiect}{" "}
                  {feedbackToView.esteVerificat ? (
                    <CheckCircleOutlineIcon
                      color="success"
                      style={{ fontSize: "3rem" }}
                    />
                  ) : (
                    <CancelOutlinedIcon
                      color="error"
                      style={{ fontSize: "3rem" }}
                    />
                  )}
                </div>
              }
              content={
                <div className="view-feedbacks-layout">
                  <div>Email: {feedbackToView.email}</div>
                  <div>Nume: {feedbackToView.nume}</div>
                  <div>Calificativ: {feedbackToView.calificativ}</div>
                  <div>Comentariu: {feedbackToView.comentariu}</div>
                  <div className="view-feedbacks-buttons">
                    <Button
                      variant="contained"
                      onClick={handleCloseViewFeedbackModal}
                    >
                      Inchide
                    </Button>
                  </div>
                </div>
              }
            />
          </div>
        );
      },
    },
  ];

  const getFeedbacks = async () => {
    await axios
      .get(BACKEND_URL + "/api/feedbacks/", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data) {
          setFeedbacks(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("../administrare");
    }
    getFeedbacks();
  }, [isLoggedIn, navigate]);

  return (
    <div className="pages-layout">
      <Header pageTitleText="Feedbacks" />
      <CustomGrid
        columns={columns}
        rows={feedbacks.map((feedback) => {
          return {
            ...feedback,
            email: feedback.email ? feedback.email : "Nespecificat",
          };
        })}
        loading={loading}
      />
    </div>
  );
};

export default FeedbacksPage;

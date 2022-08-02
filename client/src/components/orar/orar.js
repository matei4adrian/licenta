import { useContext, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentTooltip,
} from "@devexpress/dx-react-scheduler-material-ui";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorIcon from "@mui/icons-material/Error";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import RoomIcon from "@mui/icons-material/Room";
import GroupIcon from "@mui/icons-material/Group";
import Grid from "@mui/material/Grid";
import ClassIcon from "@mui/icons-material/Class";
import "./orar.scss";
import { Context } from "../contexts/user-context";
import BasicModalWithoutButtons from "../basic-modal/basic-modal-without-buttons";
import axios from "axios";
import ActivitateForm from "../forms/activitate-form";
import { BACKEND_URL } from "../../config";
import BasicModal from "../basic-modal/basic-modal";
import FeedbackForm from "../forms/feedback-form";

const PREFIX = "Orar";

const classes = {
  appointment: `${PREFIX}-appointment`,
  apptContent: `${PREFIX}-apptContent`,
  icon: `${PREFIX}-icon`,
  textCenter: `${PREFIX}-textCenter`,
};

const DayScaleCell = (props) => {
  return (
    <WeekView.DayScaleCell
      {...props}
      style={{ textAlign: "center", fontWeight: "bold" }}
    />
  );
};

const StyledAppointmentsAppointment = styled(Appointments.Appointment)(() => ({
  [`&.${classes.appointment}`]: {
    borderRadius: "10px",
    "&:hover": {
      opacity: 0.6,
    },
  },
}));

const StyledAppointmentsAppointmentContent = styled(
  Appointments.AppointmentContent
)(() => ({
  [`&.${classes.apptContent}`]: {
    "&>div>div": {
      whiteSpace: "normal !important",
      lineHeight: 1.2,
    },
  },
}));

const Appointment = ({ ...restProps }) => {
  return (
    <StyledAppointmentsAppointment
      {...restProps}
      className={classes.appointment}
    />
  );
};

const AppointmentContent = ({ ...restProps }) => {
  return (
    <StyledAppointmentsAppointmentContent
      {...restProps}
      className={classes.apptContent}
    />
  );
};

const StyledGrid = styled(Grid)(() => ({
  [`&.${classes.textCenter}`]: {
    textAlign: "center",
  },
}));

const AppointmentGrid = ({ text, info }) => {
  return (
    <Grid item xs={10}>
      <span>
        {text} {info}
      </span>
    </Grid>
  );
};

const StyledType = styled(ClassIcon)(({ theme: { palette } }) => ({
  [`&.${classes.icon}`]: {
    color: palette.action.active,
  },
}));

const StyledSala = styled(RoomIcon)(({ theme: { palette } }) => ({
  [`&.${classes.icon}`]: {
    color: palette.action.active,
  },
}));

const StyledProfesor = styled(PersonIcon)(({ theme: { palette } }) => ({
  [`&.${classes.icon}`]: {
    color: palette.action.active,
  },
}));

const StyledGrupa = styled(GroupIcon)(({ theme: { palette } }) => ({
  [`&.${classes.icon}`]: {
    color: palette.action.active,
  },
}));

const withGrid = (Icon) => {
  return (
    <StyledGrid item xs={2} className={classes.textCenter}>
      <Icon className={classes.icon} />
    </StyledGrid>
  );
};

const zileCalendar = {
  1: "luni",
  2: "marti",
  3: "miercuri",
  4: "joi",
  5: "vineri",
  6: "sambata",
};

const Header = ({
  children,
  appointmentData,
  getOrarAtChange,
  facultateId,
  setSuccessMessage,
  successMessage,
  setErrorMessage,
  errorMessage,
  ...restProps
}) => {
  const user = useContext(Context);
  const { isLoggedIn } = user;
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddFeedbackModal, setOpenAddFeedbackModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const handleCloseAddFeedbackModal = () => {
    setOpenAddFeedbackModal(false);
  };

  const handleAddFeedback = async (values) => {
    if (successMessage) {
      setSuccessMessage("");
    }
    await axios
      .post(BACKEND_URL + "/api/feedbacks/", values, {
        withCredentials: true,
      })
      .then(() => {
        handleCloseAddFeedbackModal();
        setSuccessMessage("Feedback trimis cu succes");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
  };

  const handleDeleteActivitate = async () => {
    await axios
      .delete(
        BACKEND_URL +
          `/api/facultati/${facultateId}/activitati/${appointmentData.id}`,
        {
          withCredentials: true,
        }
      )
      .then(() => {
        handleCloseDeleteModal();
        restProps.onHide();
        getOrarAtChange();
      })
      .catch((err) => console.log(err));
  };

  const handleEditActivitate = async (values) => {
    if (errorMessage) {
      setErrorMessage("");
    }
    await axios
      .put(
        BACKEND_URL +
          `/api/facultati/${facultateId}/activitati/${appointmentData.id}`,
        values,
        {
          withCredentials: true,
        }
      )
      .then(() => {
        handleCloseUpdateModal();
        restProps.onHide();
        getOrarAtChange();
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err.response.data.message);
      });
  };

  return (
    <AppointmentTooltip.Header {...restProps}>
      {isLoggedIn && (
        <>
          <IconButton
            aria-label="delete appointment"
            size="large"
            onClick={() => setOpenDeleteModal(true)}
          >
            <DeleteIcon color="error" />
          </IconButton>
          <IconButton
            aria-label="edit appointment"
            size="large"
            onClick={() => setOpenUpdateModal(true)}
          >
            <EditIcon />
          </IconButton>
        </>
      )}
      <IconButton
        aria-label="add feedback"
        size="large"
        onClick={() => setOpenAddFeedbackModal(true)}
      >
        <ErrorIcon />
      </IconButton>
      <BasicModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        title="Șterge activitate"
        onSubmit={handleDeleteActivitate}
        content={`Ești sigur că vrei să ștergi această activitate?`}
      />
      <BasicModalWithoutButtons
        open={openUpdateModal}
        onClose={handleCloseUpdateModal}
        title="Actualizați activitate"
        content={
          <ActivitateForm
            onSubmit={handleEditActivitate}
            onClose={handleCloseUpdateModal}
            facultateId={facultateId}
            submitText="Actualizează"
            toBeEdited={appointmentData}
          />
        }
      />
      <BasicModalWithoutButtons
        open={openAddFeedbackModal}
        onClose={handleCloseAddFeedbackModal}
        title="Trimite feedback"
        subTitle="Completați câmpurile obligatorii"
        content={
          <FeedbackForm
            onSubmit={handleAddFeedback}
            onClose={handleCloseAddFeedbackModal}
            submitText="Trimite"
            subiectText={`${appointmentData.type} ${appointmentData.title}, ${
              zileCalendar[appointmentData.startDate.getDay()]
            }, intre ${appointmentData.startDate.getHours()}:${
              (appointmentData.startDate.getMinutes() < 10 ? "0" : "") +
              appointmentData.startDate.getMinutes()
            } - ${appointmentData.endDate.getHours()}:${
              (appointmentData.endDate.getMinutes() < 10 ? "0" : "") +
              appointmentData.endDate.getMinutes()
            }, grupa/le ${appointmentData.grupa}, profesor ${
              appointmentData.profesor
            }, sala ${appointmentData.sala}`}
          />
        }
      />
    </AppointmentTooltip.Header>
  );
};

const Content = ({ children, appointmentData, ...restProps }) => (
  <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
    <Grid container alignItems="center">
      {withGrid(StyledType)}
      <AppointmentGrid info={appointmentData.type} />
      {withGrid(StyledGrupa)}
      <AppointmentGrid text="Grupa" info={appointmentData.grupa} />
      {withGrid(StyledProfesor)}
      <AppointmentGrid text="Profesor" info={appointmentData.profesor} />
      {withGrid(StyledSala)}
      <AppointmentGrid text="Sala" info={appointmentData.sala} />
    </Grid>
  </AppointmentTooltip.Content>
);

const Orar = ({
  appointments,
  facultateId,
  openAddOraModal,
  setOpenAddOraModal,
  setSuccessMessage,
  successMessage,
  errorMessage,
  setErrorMessage,
  getOrarAtChange,
  activitati,
  triggerRender,
  setTriggerRender,
}) => {
  const handleAddActivitate = async (values) => {
    if (errorMessage) {
      setErrorMessage("");
    }
    if (triggerRender) {
      setTriggerRender(false);
    }
    await axios
      .post(BACKEND_URL + `/api/facultati/${facultateId}/activitati`, values, {
        withCredentials: true,
      })
      .then(() => {
        getOrarAtChange();
        handleCloseAddOraModal();
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err.response.data.message);
      });
  };

  const handleCloseAddOraModal = () => {
    setOpenAddOraModal(false);
  };

  useEffect(() => {
    setTriggerRender(true);
  }, [activitati]);

  return (
    <Paper className="orar-paper">
      <Scheduler data={appointments} locale={"ro-RO"}>
        <WeekView
          startDayHour={5.75}
          endDayHour={19}
          cellDuration={105}
          excludedDays={[0]}
          dayScaleCellComponent={DayScaleCell}
        />
        <Appointments
          appointmentComponent={Appointment}
          appointmentContentComponent={AppointmentContent}
        />
        <AppointmentTooltip
          headerComponent={(props) => {
            return (
              <Header
                {...props}
                getOrarAtChange={getOrarAtChange}
                facultateId={facultateId}
                setSuccessMessage={setSuccessMessage}
                successMessage={successMessage}
                setErrorMessage={setErrorMessage}
                errorMessage={errorMessage}
              />
            );
          }}
          contentComponent={Content}
          showCloseButton
        />
      </Scheduler>
      <BasicModalWithoutButtons
        open={openAddOraModal}
        onClose={handleCloseAddOraModal}
        title="Adaugă activitate"
        subTitle="Completați câmpurile"
        content={
          <ActivitateForm
            onSubmit={handleAddActivitate}
            onClose={handleCloseAddOraModal}
            facultateId={facultateId}
            submitText="Adaugă"
          />
        }
      />
    </Paper>
  );
};

export default Orar;

import { useContext, useState } from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
// import { EditingState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentTooltip,
  // ConfirmationDialog,
  // EditRecurrenceMenu,
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

const Header = ({ children, appointmentData, ...restProps }) => {
  const user = useContext(Context);
  const { isLoggedIn } = user;

  return (
    <AppointmentTooltip.Header {...restProps}>
      {isLoggedIn && (
        <>
          <IconButton
            aria-label="add feedback"
            size="large"
            onClick={() => alert(JSON.stringify(appointmentData))}
          >
            <DeleteIcon color="error" />
          </IconButton>
          <IconButton
            aria-label="edit appointment"
            size="large"
            onClick={() => alert(JSON.stringify(appointmentData))}
          >
            <EditIcon />
          </IconButton>
        </>
      )}
      <IconButton
        aria-label="add feedback"
        size="large"
        onClick={() => alert(JSON.stringify(appointmentData))}
      >
        <ErrorIcon />
      </IconButton>
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

const Orar = ({ activitati }) => {
  const data = activitati.map((activitate) => {
    return {
      id: activitate.id,
      title: activitate.materie.denumire,
      startDate: activitate.dataInceput,
      endDate: activitate.dataSfarsit,
      type: activitate.tipActivitate,
      sala: activitate.sala.numar,
      profesor: `${activitate.profesor.nume} ${activitate.profesor.prenume}`,
      grupa: activitate.grupas.map((grupa) => grupa.numar).join(", "),
      rRule: activitate.rRule, //poa sa fie si din 2 in 2 sapt
    };
  });
  // const appointments = [
  //   {
  //     id: 0,
  //     title: "Algebra",
  //     startDate: new Date(2022, 3, 18, 18, 0),
  //     endDate: new Date(2022, 3, 18, 19, 30),
  //     type: "Seminar",
  //     sala: "1022",
  //     profesor: "Costel",
  //     grupa: "1023, 1024",
  //     rRule: "FREQ=WEEKLY;BYDAY=MO", //poa sa fie si din 2 in 2 sapt
  //   },
  // ];

  // const commitChanges = ({ added, changed, deleted }) => {
  //   setData((state) => {
  //     let { data } = state;
  //     if (added) {
  //       const startingAddedId =
  //         data.length > 0 ? data[data.length - 1].id + 1 : 0;
  //       data = [...data, { id: startingAddedId, ...added }];
  //     }
  //     if (changed) {
  //       data = data.map((appointment) =>
  //         changed[appointment.id]
  //           ? { ...appointment, ...changed[appointment.id] }
  //           : appointment
  //       );
  //     }
  //     if (deleted !== undefined) {
  //       data = data.filter((appointment) => appointment.id !== deleted);
  //     }
  //     return { data };
  //   });
  // };

  return (
    <Paper className="orar-paper">
      <Scheduler data={data} locale={"ro-RO"}>
        {/* <EditingState onCommitChanges={commitChanges}  /> */}

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
        {/* <EditRecurrenceMenu /> */}
        {/* <ConfirmationDialog /> */}
        <AppointmentTooltip
          headerComponent={Header}
          contentComponent={Content}
          showCloseButton
        />
      </Scheduler>
    </Paper>
  );
};

export default Orar;

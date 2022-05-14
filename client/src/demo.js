import React from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { ViewState, EditingState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentTooltip,
  ConfirmationDialog,
  AppointmentForm,
  EditRecurrenceMenu,
  Resources,
} from "@devexpress/dx-react-scheduler-material-ui";
import IconButton from "@mui/material/IconButton";
import ErrorIcon from "@mui/icons-material/Error";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import RoomIcon from "@mui/icons-material/Room";
import GroupIcon from "@mui/icons-material/Group";
// import { type } from "./demo-data/tasks";
import Grid from "@mui/material/Grid";
import ClassIcon from "@mui/icons-material/Class";

const PREFIX = "Demo";

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

const appointments = [
  {
    id: 0,
    title: "Algebra",
    startDate: new Date(2022, 3, 18, 9, 15),
    endDate: new Date(2022, 3, 18, 10, 45),
    type: "Seminar",
    sala: "1022",
    profesor: "Costel",
    grupa: "1023, 1024",
    rRule: "FREQ=WEEKLY;BYDAY=MO", //poa sa fie si din 2 in 2 sapt
  },
  {
    id: 1,
    title: "ATP",
    startDate: new Date(2022, 3, 18, 9, 15),
    endDate: new Date(2022, 3, 18, 10, 45),
    type: "Curs",
    sala: "1022",
    profesor: "Costel",
    grupa: "1023, 1024",
    rRule: "FREQ=WEEKLY;BYDAY=MO",
  },
];

// const resources = [
//   {
//     fieldName: "typeId",
//     title: "Type",
//     instances: type,
//   },
// ];

const Appointment = ({ ...restProps }) => {
  // console.log(restProps);
  return (
    <StyledAppointmentsAppointment
      {...restProps}
      className={classes.appointment}
    />
  );
};

const AppointmentContent = ({ ...restProps }) => {
  // console.log(restProps);
  return (
    <StyledAppointmentsAppointmentContent
      {...restProps}
      className={classes.apptContent}
    />
  );
};

const Header = ({ children, appointmentData, ...restProps }) => {
  // console.log(restProps);
  return (
    <AppointmentTooltip.Header {...restProps}>
      <IconButton
        aria-label="edit appointment"
        size="large"
        onClick={() => alert(JSON.stringify(appointmentData))}
      >
        <EditIcon />
      </IconButton>
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

// const TextEditor = (props) => {
//   if (props.type === "multilineTextEditor") {
//     return null;
//   }
//   return <AppointmentForm.TextEditor {...props} />;
// };

// const BooleanEditor = (props) => {
//   if (props.label === "All Day") {
//     return null;
//   }

//   console.log(props);
//   return <AppointmentForm.BooleanEditor {...props} />;
// };

// const Label = (props) => {
//   if (props.text === "More Information") {
//     return null;
//   }
//   return <AppointmentForm.Label {...props} />;
// };

// const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
//   // const onTypeFieldChange = (nextValue) => {
//   //   onFieldChange({ type: nextValue });
//   // };

//   return (
//     <AppointmentForm.BasicLayout
//       appointmentData={appointmentData}
//       onFieldChange={onFieldChange}
//       {...restProps}
//     >
//       {/* <AppointmentForm.Label text="Type" type="title" />
//       <AppointmentForm.Select
//         value={appointmentData.type}
//         onValueChange={onTypeFieldChange}
//         availableOptions={[
//           { id: "1", text: "Seminar" },
//           { id: "2", text: "Curs" },
//         ]}
//         type="filledSelect"
//       /> */}
//     </AppointmentForm.BasicLayout>
//   );
// };

// const SelectComponent = (props) => {
//   return (
//     <AppointmentForm.Select
//       {...props}
//       availableOptions={[props.availableOptions[1]]}
//     />
//   );
// };

// const RecurrenceLayout = ({ ...restProps }) => {
//   console.log(restProps);
//   return (
//     <AppointmentForm.RecurrenceLayout
//       {...restProps}
//       firstDayOfWeek={1}
//       selectComponent={SelectComponent}
//     />
//   );
// };

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

export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: appointments,
    };

    this.commitChanges = this.commitChanges.bind(this);
  }

  submitForm(e) {
    e.preventDefault();
    const name = document.getElementById("name");
    const files = document.getElementById("files");
    const formData = new FormData();
    formData.append("compania", name.value);
    formData.append("fotografie", files.files[0]);

    fetch("http://localhost:8080/api/vouchers/", {
      method: "POST",
      body: formData,
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
    })
      .then((res) => console.log("dsd", res))
      .catch((err) => ("Error occured", err));
  }

  commitChanges({ added, changed, deleted }) {
    this.setState((state) => {
      console.log("sds");
      let { data } = state;
      if (added) {
        const startingAddedId =
          data.length > 0 ? data[data.length - 1].id + 1 : 0;
        data = [...data, { id: startingAddedId, ...added }];
      }
      if (changed) {
        data = data.map((appointment) =>
          changed[appointment.id]
            ? { ...appointment, ...changed[appointment.id] }
            : appointment
        );
      }
      if (deleted !== undefined) {
        data = data.filter((appointment) => appointment.id !== deleted);
      }
      return { data };
    });
  }

  render() {
    const { data } = this.state;

    return (
      <Paper>
        <Scheduler data={data} locale={"ro-RO"}>
          <EditingState onCommitChanges={this.commitChanges} />
          {/* <ViewState defaultCurrentDate="2022-04-19" /> */}

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
          {/* <Resources data={resources} /> */}
          <EditRecurrenceMenu />
          <ConfirmationDialog />
          <AppointmentTooltip
            headerComponent={Header}
            contentComponent={Content}
            showCloseButton
            showDeleteButton
          />
          {/* <AppointmentForm
            basicLayoutComponent={BasicLayout}
            textEditorComponent={TextEditor}
            labelComponent={Label}
            booleanEditorComponent={BooleanEditor}
            recurrenceLayoutComponent={RecurrenceLayout}
          /> */}
        </Scheduler>

        <body>
          <div class="container">
            <h1>File Upload</h1>
            <form id="form" onSubmit={this.submitForm}>
              <div class="input-group">
                <label for="name">Your name</label>
                <input name="name" id="name" placeholder="Enter your name" />
              </div>
              <div class="input-group">
                <label for="files">Select files</label>
                <input id="files" type="file" />
              </div>
              <button class="submit-btn" type="submit">
                Upload
              </button>
            </form>
          </div>
        </body>
      </Paper>
    );
  }
}

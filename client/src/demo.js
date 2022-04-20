import React, { useEffect } from "react";
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
import { type } from "./demo-data/tasks";

const PREFIX = "Demo";

const classes = {
  cell: `${PREFIX}-cell`,
  content: `${PREFIX}-content`,
  text: `${PREFIX}-text`,
  sun: `${PREFIX}-sun`,
  cloud: `${PREFIX}-cloud`,
  rain: `${PREFIX}-rain`,
  sunBack: `${PREFIX}-sunBack`,
  cloudBack: `${PREFIX}-cloudBack`,
  rainBack: `${PREFIX}-rainBack`,
  opacity: `${PREFIX}-opacity`,
  appointment: `${PREFIX}-appointment`,
  apptContent: `${PREFIX}-apptContent`,
  flexibleSpace: `${PREFIX}-flexibleSpace`,
  flexContainer: `${PREFIX}-flexContainer`,
  tooltipContent: `${PREFIX}-tooltipContent`,
  tooltipText: `${PREFIX}-tooltipText`,
  title: `${PREFIX}-title`,
  icon: `${PREFIX}-icon`,
  circle: `${PREFIX}-circle`,
  textCenter: `${PREFIX}-textCenter`,
  dateAndTitle: `${PREFIX}-dateAndTitle`,
  titleContainer: `${PREFIX}-titleContainer`,
  container: `${PREFIX}-container`,
  commandButton: `${PREFIX}-commandButton`,
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
    rRule: "FREQ=WEEKLY;BYDAY=MO",
    // ownerId: 1,
  },
  {
    id: 1,
    title: "ATP",
    startDate: new Date(2022, 3, 18, 9, 15),
    endDate: new Date(2022, 3, 18, 10, 45),
    rRule: "FREQ=WEEKLY;BYDAY=MO",
  },
];

const resources = [
  {
    fieldName: "typeId",
    title: "Type",
    instances: type,
  },
];

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
        aria-label="add to shopping cart"
        size="large"
        onClick={() => alert(JSON.stringify(appointmentData))}
      >
        <ErrorIcon />
      </IconButton>
    </AppointmentTooltip.Header>
  );
};

const TextEditor = (props) => {
  if (props.type === "multilineTextEditor") {
    return null;
  }
  return <AppointmentForm.TextEditor {...props} />;
};

const BooleanEditor = (props) => {
  if (props.label === "All Day") {
    return null;
  }

  console.log(props);
  return <AppointmentForm.BooleanEditor {...props} />;
};

const Label = (props) => {
  if (props.text === "More Information") {
    return null;
  }
  return <AppointmentForm.Label {...props} />;
};

const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
  const onTypeFieldChange = (nextValue) => {
    onFieldChange({ type: nextValue });
  };

  return (
    <AppointmentForm.BasicLayout
      appointmentData={appointmentData}
      onFieldChange={onFieldChange}
      {...restProps}
    >
      {/* <AppointmentForm.Label text="Type" type="title" />
      <AppointmentForm.Select
        value={appointmentData.type}
        onValueChange={onTypeFieldChange}
        availableOptions={[
          { id: "1", text: "Seminar" },
          { id: "2", text: "Curs" },
        ]}
        type="filledSelect"
      /> */}
    </AppointmentForm.BasicLayout>
  );
};

const SelectComponent = (props) => {
  return (
    <AppointmentForm.Select
      {...props}
      availableOptions={[props.availableOptions[1]]}
    />
  );
};

const RecurrenceLayout = ({ ...restProps }) => {
  console.log(restProps);
  return (
    <AppointmentForm.RecurrenceLayout
      {...restProps}
      firstDayOfWeek={1}
      selectComponent={SelectComponent}
    />
  );
};

export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: appointments,
    };

    this.commitChanges = this.commitChanges.bind(this);
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
          <ViewState defaultCurrentDate="2022-04-17" />

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
          <Resources data={resources} />
          <EditRecurrenceMenu />
          <ConfirmationDialog />
          <AppointmentTooltip
            headerComponent={Header}
            showCloseButton
            showDeleteButton
            showOpenButton
          />
          <AppointmentForm
            basicLayoutComponent={BasicLayout}
            textEditorComponent={TextEditor}
            labelComponent={Label}
            booleanEditorComponent={BooleanEditor}
            recurrenceLayoutComponent={RecurrenceLayout}
          />
        </Scheduler>
      </Paper>
    );
  }
}

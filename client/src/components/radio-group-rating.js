import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";

const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
    color: theme.palette.action.disabled,
  },
}));

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon color="error" />,
  },
  2: {
    icon: <SentimentDissatisfiedIcon color="error" />,
  },
  3: {
    icon: <SentimentSatisfiedIcon color="warning" />,
  },
  4: {
    icon: <SentimentSatisfiedAltIcon color="success" />,
  },
  5: {
    icon: <SentimentVerySatisfiedIcon color="success" />,
  },
};

const IconContainer = (props) => {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
};

IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
};

const RadioGroupRating = (props) => {
  return (
    <StyledRating
      {...props}
      sx={{
        "& .MuiSvgIcon-root": {
          fontSize: 40,
        },
      }}
      IconContainerComponent={IconContainer}
      highlightSelectedOnly
    />
  );
};

export default RadioGroupRating;

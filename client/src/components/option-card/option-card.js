import * as React from "react";
import "./option-card.scss";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";

const OptionCard = (props) => {
  const { denumire, to } = props;

  return (
    <Card sx={{ width: 200, height: 100 }} className="option-card-layout">
      <CardActionArea href={to} className="option-card-action-area">
        <CardContent className="option-card-content">
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            style={{ textAlign: "center" }}
          >
            {denumire}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default OptionCard;

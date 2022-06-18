import * as React from "react";
import "./clickable-facultate-card.scss";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { ButtonBase } from "@mui/material";
import { BACKEND_URL } from "../../config";

const ClickableFacultateCard = ({ onClick, facultate }) => {
  return (
    <Card className="facultate-card">
      <ButtonBase
        onClick={() => onClick(facultate.id)}
        className="facultate-card-content"
      >
        <CardMedia
          component="img"
          height="200"
          image={`${BACKEND_URL}/uploads/${facultate.fotografie}`}
          alt={facultate.denumire}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {facultate.denumire}
          </Typography>
        </CardContent>
      </ButtonBase>
    </Card>
  );
};

export default ClickableFacultateCard;

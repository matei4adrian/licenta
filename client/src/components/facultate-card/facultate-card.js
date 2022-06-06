import * as React from "react";
import "./facultate-card.scss";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const facultate = {
  id: 1,
  denumire: "Facultate de Cibernetica, Statistica si Informatica Economica",
  fotografie:
    "https://iso.500px.com/wp-content/uploads/2016/03/stock-photo-142984111.jpg",
};

const FacultateCard = () => {
  return (
    <Card sx={{ width: 300 }} className="facultate-card-content">
      <CardMedia
        component="img"
        height="200"
        image={facultate.fotografie}
        alt={facultate.denumire}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {facultate.denumire}
        </Typography>
      </CardContent>
      <CardActions className="facultate-card-button">
        <Button variant="contained" endIcon={<NavigateNextIcon />}>
          Alege
        </Button>
      </CardActions>
    </Card>
  );
};

export default FacultateCard;

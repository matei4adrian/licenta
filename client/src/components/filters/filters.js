import { useEffect, useState } from "react";
import "./filters.scss";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import FilterForm from "../forms/filter-form";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { CircularProgress } from "@mui/material";

const Filters = ({ facultateId, onSubmit }) => {
  const [value, setValue] = useState("1");
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getOptions = async () => {
    await axios
      .get(BACKEND_URL + `/api/facultati/${facultateId}/options`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data) {
          setOptions(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getOptions();
  }, []);

  return loading ? (
    <div className="loading-filters-page">
      <CircularProgress />
    </div>
  ) : (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} centered>
            <Tab label="Grupa" value="1" />
            <Tab label="Materie" value="2" />
            <Tab label="Profesor" value="3" />
            <Tab label="Sala" value="4" />
          </TabList>
        </Box>
        <div className="tab-content">
          <TabPanel value="1">
            <FilterForm
              onSubmit={onSubmit}
              tipFiltru="grupa"
              options={options.grupe}
              label="Grupa"
            />
          </TabPanel>
          <TabPanel value="2">
            <FilterForm
              onSubmit={onSubmit}
              tipFiltru="materie"
              options={options.materii}
              label="Materie"
            />
          </TabPanel>
          <TabPanel value="3">
            <FilterForm
              onSubmit={onSubmit}
              tipFiltru="profesor"
              options={options.profesori}
              label="Profesor"
            />
          </TabPanel>
          <TabPanel value="4">
            <FilterForm
              onSubmit={onSubmit}
              tipFiltru="sala"
              options={options.sali}
              label="Sala"
            />
          </TabPanel>
        </div>
      </TabContext>
    </Box>
  );
};

export default Filters;

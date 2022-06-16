import React, { useEffect, useState } from "react";
import "./statistici-page.scss";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { CircularProgress } from "@mui/material";
import Header from "../../components/administrare-child-page/header";
import axios from "axios";
import { BACKEND_URL } from "../../config";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Numar profesori/numar grupe la care desfasoara activitati",
    },
  },
};

const StatisticiPage = () => {
  const [statistici, setStatistici] = useState({
    usersStats: {
      activeUsers: 0,
      newUsers: 0,
    },
    feedbacksStats: {
      resolvedFeedbacks: 0,
      unresolvedFeedbacks: 0,
    },
    profesorGrupeStats: {
      max3: 0,
      max5: 0,
      above5: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const { usersStats, feedbacksStats, profesorGrupeStats } = statistici;

  const getStatistici = async () => {
    await axios
      .get(BACKEND_URL + "/api/statistici/")
      .then((res) => {
        if (res.data) {
          setStatistici(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getStatistici();
  }, []);

  const profesorGrupeData = {
    labels: ["1-3 grupe", "4-5 grupe", "5+ grupe"],
    datasets: [
      {
        label: "nr. profesori",
        data: [
          profesorGrupeStats.max3,
          profesorGrupeStats.max5,
          profesorGrupeStats.above5,
        ],
        backgroundColor: "rgba(25, 118, 210, 0.5)",
      },
    ],
  };

  const usersData = {
    labels: ["Administratori activi", "Administratori noi"],
    datasets: [
      {
        data: [usersStats.activeUsers, usersStats.newUsers],
        backgroundColor: ["rgba(25, 118, 210, 0.5)", "rgba(60, 179, 113, 0.2)"],
        borderColor: ["rgba(25, 118, 210, 1)", "rgba(60, 179, 113, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const feedbacksData = {
    labels: ["Feedback-uri rezolvate", "Feedback-uri nerezolvate"],
    datasets: [
      {
        data: [
          feedbacksStats.resolvedFeedbacks,
          feedbacksStats.unresolvedFeedbacks,
        ],
        backgroundColor: ["rgba(25, 118, 210, 0.5)", "rgba(60, 179, 113, 0.2)"],
        borderColor: ["rgba(25, 118, 210, 1)", "rgba(60, 179, 113, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="statistici-page">
      {loading ? (
        <div className="loading-statistici-page">
          <CircularProgress />
        </div>
      ) : (
        <div className="statistici-layout">
          <Header pageTitleText="Statistici" />
          <div className="statistici-pies">
            <div className="statistici-pie">
              <Pie data={usersData} />
            </div>
            <div className="statistici-bar">
              <Bar options={options} data={profesorGrupeData} />
            </div>
            <div className="statistici-pie">
              <Pie data={feedbacksData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticiPage;

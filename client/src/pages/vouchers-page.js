import React, { useContext, useState, useEffect } from "react";
import "./cards-page.scss";
import { Typography } from "@mui/material";
import axios from "axios";
import { Context } from "../components/contexts/user-context";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import VoucherCard from "../components/voucher-card/voucher-card";
import { BACKEND_URL } from "../config";
import BasicModalWithoutButtons from "../components/basic-modal/basic-modal-without-buttons";
import VoucherForm from "../components/forms/voucher-form";

const VoucherPage = () => {
  const user = useContext(Context);
  const [open, setOpen] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddVoucher = async (values) => {
    var formData = new FormData();
    formData.append("compania", values.compania);
    formData.append("fotografie", values.fotografie);
    formData.append("descriere", values.descriere);
    formData.append("valoare", values.valoare);
    await axios
      .post(BACKEND_URL + "/api/vouchers/", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        handleClose();
        getVouchers();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getVouchers = async () => {
    await axios
      .get(BACKEND_URL + "/api/vouchers/")
      .then((res) => {
        if (res.data) {
          setVouchers(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getVouchers();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="loading-cards-page">
          <CircularProgress />
        </div>
      ) : (
        <div className="cards-layout">
          {user.isLoggedIn && (
            <div className="cards-page-buttons-container">
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpen}
              >
                Adaugă voucher
              </Button>
              <BasicModalWithoutButtons
                open={open}
                onClose={handleClose}
                title="Adaugă voucher"
                subTitle="Completați câmpurile"
                content={
                  <VoucherForm
                    onSubmit={handleAddVoucher}
                    onClose={handleClose}
                    submitText="Adaugă"
                  />
                }
              />
            </div>
          )}
          {vouchers.length !== 0 ? (
            <div className="cards">
              {vouchers.map((voucher) => (
                <VoucherCard
                  voucher={voucher}
                  getVouchers={getVouchers}
                  key={voucher.id}
                />
              ))}
            </div>
          ) : (
            <Typography variant="h3" className="no-card-added">
              Niciun voucher nu a fost adăugat
            </Typography>
          )}
        </div>
      )}
    </div>
  );
};

export default VoucherPage;

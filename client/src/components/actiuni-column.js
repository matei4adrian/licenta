import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import BasicModalWithoutButtons from "./basic-modal/basic-modal-without-buttons";
import BasicModal from "./basic-modal/basic-modal";

const ActiuniColumn = ({
  params,
  getItems,
  openUpdateModal,
  openDeleteModal,
  setOpenUpdateModal,
  setOpenDeleteModal,
  toBeEdited,
  setToBeEdited,
  setToBeDeleted,
  editUrl,
  deleteUrl,
  updateTitle,
  deleteTitle,
  deleteContent,
  Form,
  errorMessage,
  setErrorMessage,
}) => {
  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
  };

  const handleOpenUpdateModal = () => {
    setToBeEdited(params.row);
    setOpenUpdateModal(true);
  };

  const handleOpenDeleteModal = () => {
    setToBeDeleted(params.row);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const handleEdit = async (values) => {
    if (errorMessage) {
      setErrorMessage("");
    }
    console.log(values);
    await axios
      .put(editUrl, values, {
        withCredentials: true,
      })
      .then(() => {
        handleCloseUpdateModal();
        getItems();
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err.response.data.message);
      });
  };

  const handleDeleteSerie = async () => {
    await axios
      .delete(deleteUrl, {
        withCredentials: true,
      })
      .then(() => {
        handleCloseDeleteModal();
        getItems();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <IconButton aria-label="edit" onClick={handleOpenUpdateModal}>
        <EditIcon />
      </IconButton>
      <IconButton
        aria-label="delete"
        color="error"
        onClick={handleOpenDeleteModal}
      >
        <DeleteIcon />
      </IconButton>
      <BasicModalWithoutButtons
        open={openUpdateModal}
        onClose={handleCloseUpdateModal}
        title={updateTitle}
        content={
          <Form
            onSubmit={handleEdit}
            onClose={handleCloseUpdateModal}
            submitText="Actualizează"
            toBeEdited={toBeEdited}
          />
        }
      />
      <BasicModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        title={deleteTitle}
        onSubmit={handleDeleteSerie}
        content={deleteContent}
      />
    </div>
  );
};

export default ActiuniColumn;

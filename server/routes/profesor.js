const express = require("express");
const router = express.Router();
const profesorController = require("../controllers").profesor;
const otherController = require("../controllers").other;

router.get("/", profesorController.getAll);
router.post("/", profesorController.add);
router.post(
  "/:profesorId/materii/:materieId",
  profesorController.addProfesorToMaterie
);
router.put("/:profesorId", profesorController.update);
router.delete("/:profesorId", profesorController.delete);
router.delete(
  "/:profesorId/materii/:materieId",
  profesorController.removeProfesorFromMaterie
);

module.exports = router;

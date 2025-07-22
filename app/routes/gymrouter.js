const express = require("express");
const router = express.Router();
const ejercisioController = require('../controllers/ejercisioController');

router.get("/ejercicios", ejercisioController.buscarTodo)
      .post("/ejercicios", ejercisioController.guardarEjercicio)
      .get("/ejercicios/:key/:value", ejercisioController.buscarEjercicio, ejercisioController.mostrarEjercicio)
      .put("/ejercicios/:key/:value", ejercisioController.buscarEjercicio, ejercisioController.actualizarEjercicio)
      .delete("/ejercicios/:key/:value", ejercisioController.buscarEjercicio, ejercisioController.eliminarEjercicio);

module.exports = router;
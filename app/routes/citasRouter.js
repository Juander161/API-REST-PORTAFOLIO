const express = require("express")
const router = express.Router()
const citaController = require("../controllers/citaController")
const { auth } = require("../middleware/auth")

router.use(auth) // Todas las rutas requieren autenticación

router.get("/", citaController.obtenerCitas)
router.post("/", citaController.crearCita)
router.get("/:id", citaController.obtenerCita)
router.put("/:id", citaController.actualizarCita)
router.delete("/:id", citaController.eliminarCita)

module.exports = router

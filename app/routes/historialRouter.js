const express = require("express")
const router = express.Router()
const historialController = require("../controllers/historialController")
const { auth } = require("../middleware/auth")

router.use(auth) // Todas las rutas requieren autenticación

router.get("/", historialController.obtenerHistoriales)
router.post("/", historialController.crearHistorial)
router.get("/:id", historialController.obtenerHistorial)
router.put("/:id", historialController.actualizarHistorial)
router.delete("/:id", historialController.eliminarHistorial)

module.exports = router

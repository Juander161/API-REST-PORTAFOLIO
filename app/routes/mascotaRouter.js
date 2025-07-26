const express = require("express")
const router = express.Router()
const mascotaController = require("../controllers/mascotaController")
const { auth } = require("../middleware/auth")

router.use(auth) // Todas las rutas requieren autenticación

router.get("/", mascotaController.obtenerMascotas)
router.post("/", mascotaController.crearMascota)
router.get("/:id", mascotaController.obtenerMascota)
router.put("/:id", mascotaController.actualizarMascota)
router.delete("/:id", mascotaController.eliminarMascota)

module.exports = router

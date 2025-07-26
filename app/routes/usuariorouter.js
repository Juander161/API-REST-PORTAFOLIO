const express = require("express")
const router = express.Router()
const usuarioController = require("../controllers/usuarioController")
const { auth, authorize } = require("../middleware/auth")

router.use(auth) // Todas las rutas requieren autenticación

router.get("/", authorize("admin", "recepcionista"), usuarioController.obtenerUsuarios)
router.get("/:id", usuarioController.obtenerUsuario)
router.put("/:id", usuarioController.actualizarUsuario)
router.delete("/:id", authorize("admin"), usuarioController.eliminarUsuario)

module.exports = router

const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const { auth } = require("../middleware/auth")

router.post("/registro", authController.registro)
router.post("/login", authController.login)
router.get("/perfil", auth, authController.obtenerPerfil)

module.exports = router

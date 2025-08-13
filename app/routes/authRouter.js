const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const { auth } = require("../middleware/auth")
const { validateUserRegistration, validateLogin } = require("../middleware/validation")

/**
 * @swagger
 * /api/auth/registro:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: Crea una nueva cuenta de usuario en el sistema. El email debe ser único.
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioRegistro'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaAuth'
 *       400:
 *         description: Error en los datos proporcionados o email ya existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaError'
 */
router.post("/registro", validateUserRegistration, authController.registro)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     description: Autentica un usuario y devuelve un token JWT para acceder a endpoints protegidos.
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioLogin'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaAuth'
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaError'
 *       400:
 *         description: Error de validación en los datos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaError'
 */
router.post("/login", validateLogin, authController.login)

/**
 * @swagger
 * /api/auth/perfil:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     description: Devuelve la información completa del usuario autenticado, incluyendo sus mascotas.
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/RespuestaExito'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         usuario:
 *                           $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Token no válido o no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaError'
 */
router.get("/perfil", auth, authController.obtenerPerfil)

module.exports = router

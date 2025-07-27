const express = require("express")
const router = express.Router()
const citaController = require("../controllers/citaController")
const { auth } = require("../middleware/auth")

router.use(auth) // Todas las rutas requieren autenticación

/**
 * @swagger
 * /api/citas:
 *   get:
 *     summary: Obtener todas las citas
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de citas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 citas:
 *                   type: array
 *                   items:
 *                     type: object
 *       204:
 *         description: No hay citas programadas
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get("/", citaController.obtenerCitas)

/**
 * @swagger
 * /api/citas:
 *   post:
 *     summary: Crear una nueva cita
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_mascota
 *               - id_veterinario
 *               - fecha_hora
 *               - motivo
 *             properties:
 *               id_mascota:
 *                 type: string
 *                 description: ID de la mascota
 *               id_veterinario:
 *                 type: string
 *                 description: ID del veterinario
 *               fecha_hora:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora de la cita
 *               motivo:
 *                 type: string
 *                 description: Motivo de la cita
 *               estado:
 *                 type: string
 *                 enum: [programada, confirmada, cancelada, completada]
 *                 default: programada
 *                 description: Estado de la cita
 *     responses:
 *       201:
 *         description: Cita creada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos para crear citas
 *       404:
 *         description: Mascota no encontrada
 *       500:
 *         description: Error del servidor
 */
router.post("/", citaController.crearCita)

/**
 * @swagger
 * /api/citas/{id}:
 *   get:
 *     summary: Obtener una cita específica
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cita
 *     responses:
 *       200:
 *         description: Cita obtenida exitosamente
 *       404:
 *         description: Cita no encontrada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos para ver esta cita
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", citaController.obtenerCita)

/**
 * @swagger
 * /api/citas/{id}:
 *   put:
 *     summary: Actualizar una cita
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cita
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_hora:
 *                 type: string
 *                 format: date-time
 *               motivo:
 *                 type: string
 *               estado:
 *                 type: string
 *                 enum: [programada, confirmada, cancelada, completada]
 *     responses:
 *       200:
 *         description: Cita actualizada exitosamente
 *       404:
 *         description: Cita no encontrada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos para actualizar esta cita
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", citaController.actualizarCita)

/**
 * @swagger
 * /api/citas/{id}:
 *   delete:
 *     summary: Eliminar una cita
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cita
 *     responses:
 *       200:
 *         description: Cita eliminada exitosamente
 *       404:
 *         description: Cita no encontrada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos para eliminar esta cita
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", citaController.eliminarCita)

module.exports = router

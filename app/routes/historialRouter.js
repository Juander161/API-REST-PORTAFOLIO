const express = require("express")
const router = express.Router()
const historialController = require("../controllers/historialController")
const { auth } = require("../middleware/auth")

router.use(auth) // Todas las rutas requieren autenticación

/**
 * @swagger
 * /api/historiales:
 *   get:
 *     summary: Obtener todos los historiales médicos
 *     tags: [Historiales Médicos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de historiales obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 historiales:
 *                   type: array
 *                   items:
 *                     type: object
 *       204:
 *         description: No hay historiales registrados
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get("/", historialController.obtenerHistoriales)

/**
 * @swagger
 * /api/historiales:
 *   post:
 *     summary: Crear un nuevo historial médico
 *     tags: [Historiales Médicos]
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
 *               - sintomas
 *               - diagnostico
 *               - tratamiento
 *             properties:
 *               id_mascota:
 *                 type: string
 *                 description: ID de la mascota
 *               fecha_consulta:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de la consulta
 *               sintomas:
 *                 type: string
 *                 description: Síntomas presentados
 *               diagnostico:
 *                 type: string
 *                 description: Diagnóstico realizado
 *               tratamiento:
 *                 type: string
 *                 description: Tratamiento prescrito
 *               observaciones:
 *                 type: string
 *                 description: Observaciones adicionales
 *     responses:
 *       201:
 *         description: Historial médico creado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos para crear historiales
 *       404:
 *         description: Mascota no encontrada
 *       500:
 *         description: Error del servidor
 */
router.post("/", historialController.crearHistorial)

/**
 * @swagger
 * /api/historiales/{id}:
 *   get:
 *     summary: Obtener un historial médico específico
 *     tags: [Historiales Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del historial médico
 *     responses:
 *       200:
 *         description: Historial médico obtenido exitosamente
 *       404:
 *         description: Historial médico no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos para ver este historial
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", historialController.obtenerHistorial)

/**
 * @swagger
 * /api/historiales/{id}:
 *   put:
 *     summary: Actualizar un historial médico
 *     tags: [Historiales Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del historial médico
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sintomas:
 *                 type: string
 *               diagnostico:
 *                 type: string
 *               tratamiento:
 *                 type: string
 *               observaciones:
 *                 type: string
 *     responses:
 *       200:
 *         description: Historial médico actualizado exitosamente
 *       404:
 *         description: Historial médico no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos para actualizar historiales
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", historialController.actualizarHistorial)

/**
 * @swagger
 * /api/historiales/{id}:
 *   delete:
 *     summary: Eliminar un historial médico
 *     tags: [Historiales Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del historial médico
 *     responses:
 *       200:
 *         description: Historial médico eliminado exitosamente
 *       404:
 *         description: Historial médico no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos para eliminar historiales
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", historialController.eliminarHistorial)

module.exports = router

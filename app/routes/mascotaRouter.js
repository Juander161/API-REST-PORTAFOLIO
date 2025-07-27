const express = require("express")
const router = express.Router()
const mascotaController = require("../controllers/mascotaController")
const { auth } = require("../middleware/auth")

router.use(auth) // Todas las rutas requieren autenticación

/**
 * @swagger
 * /api/mascotas:
 *   get:
 *     summary: Obtener todas las mascotas
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mascotas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 mascotas:
 *                   type: array
 *                   items:
 *                     type: object
 *       204:
 *         description: No hay mascotas registradas
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get("/", mascotaController.obtenerMascotas)

/**
 * @swagger
 * /api/mascotas:
 *   post:
 *     summary: Crear una nueva mascota
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - especie
 *               - raza
 *               - edad
 *               - peso
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de la mascota
 *               especie:
 *                 type: string
 *                 description: Especie de la mascota
 *               raza:
 *                 type: string
 *                 description: Raza de la mascota
 *               edad:
 *                 type: number
 *                 description: Edad de la mascota en años
 *               peso:
 *                 type: number
 *                 description: Peso de la mascota en kg
 *               id_propietario:
 *                 type: string
 *                 description: ID del propietario (automático si es cliente)
 *     responses:
 *       201:
 *         description: Mascota creada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos para crear mascotas
 *       500:
 *         description: Error del servidor
 */
router.post("/", mascotaController.crearMascota)

/**
 * @swagger
 * /api/mascotas/{id}:
 *   get:
 *     summary: Obtener una mascota específica
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota obtenida exitosamente
 *       404:
 *         description: Mascota no encontrada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos para ver esta mascota
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", mascotaController.obtenerMascota)

/**
 * @swagger
 * /api/mascotas/{id}:
 *   put:
 *     summary: Actualizar una mascota
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               especie:
 *                 type: string
 *               raza:
 *                 type: string
 *               edad:
 *                 type: number
 *               peso:
 *                 type: number
 *     responses:
 *       200:
 *         description: Mascota actualizada exitosamente
 *       404:
 *         description: Mascota no encontrada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos para actualizar esta mascota
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", mascotaController.actualizarMascota)

/**
 * @swagger
 * /api/mascotas/{id}:
 *   delete:
 *     summary: Eliminar una mascota
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota eliminada exitosamente
 *       404:
 *         description: Mascota no encontrada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos para eliminar mascotas
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", mascotaController.eliminarMascota)

module.exports = router

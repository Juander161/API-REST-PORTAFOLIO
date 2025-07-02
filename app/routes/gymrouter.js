const express = require("express")
const router = express.Router()
const ejercisioController = require('../controllers/ejercisioController')

router.get("/ejercicios", ejercisioController.buscarTodo)

module.exports = router
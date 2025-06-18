const express = require("express")
const router = express.Router()

router.get("/ejercisios", ( req, res ) =>{
    res.json({mensaje:"hola mundo"})
})

module.exports = router
const ejercicioModel = require("../models/ejercisioModel")



function buscarTodo (req, res){
    ejercicioModel.find({})
    .then(ejercisios => {
        if (ejercisios.length){
            return res.status(200).send({ejercisios})

        } else res.status(204).send({mensaje: "no hay infromacion para mostrar"})
    })
    .catch(error => { return res.status(404).send({mensaje: "error al mostrar la informacion" + error}) })
}

module.exports = ({
    buscarTodo
})
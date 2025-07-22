const ejercicioModel = require("../models/ejercisioModel");

function buscarTodo(req, res) {
    ejercicioModel.find({})
        .then(ejercisios => {
            if (ejercisios.length) {
                return res.status(200).send({ ejercisios });
            }
            return res.status(204).send({ mensaje: "No hay información para mostrar" });
        })
        .catch(error => {
            console.error("Error al buscar ejercicios:", error);
            return res.status(500).send({ mensaje: "Error interno al mostrar la información", error: error.message });
        });
}

function guardarEjercicio(req, res) {
    console.log(req.body);
    new ejercicioModel(req.body).save()
        .then(info => {
            return res.status(200).send({ mensaje: "Información guardada con éxito", info });
        })
        .catch(e => {
            console.error("Error al guardar ejercicio:", e);
            return res.status(500).send({ mensaje: "Error interno al guardar la información", error: e.message });
        });
}

function buscarEjercicio(req, res, next) {
    let consulta = {};
    consulta[req.params.key] = req.params.value;

    ejercicioModel.find(consulta)
        .then(info => {
            if (!info.length) return next();
            req.body.ejercicios = info;
            return next();
        })
        .catch(e => {  // Corregido: .cath -> .catch
            req.body.error = e;
            return next();
        });
}

function mostrarEjercicio(req, res) {
    if (req.body.error) {
        return res.status(500).send({
            mensaje: "Error al buscar ejercicios",
            error: req.body.error.message
        });
    }

    if (!req.body.ejercicios || !req.body.ejercicios.length) {
        return res.status(204).send({
            mensaje: "No hay información para mostrar"
        });
    }

    return res.status(200).send({
        ejercicios: req.body.ejercicios
    });
}

function actualizarEjercicio(req, res) {
    req.body = req.body || {};

    if (req.body.e) {
        return res.status(404).send({
            mensaje: "Error al buscar la información",
            error: req.body.e
        });
    }

    if (!req.body.ejercicios || !req.body.ejercicios.length) {
        return res.status(204).send({
            mensaje: "No hay información que actualizar"
        });
    }

    let ejercicio = req.body.ejercicios[0];

    Object.assign(ejercicio, req.body);

    ejercicio.save()
        .then(info => {
            return res.status(200).send({
                mensaje: "Información actualizada con éxito",
                info
            });
        })
        .catch(e => {
            return res.status(404).send({
                mensaje: "Error al actualizar la información",
                e
            });
        });
}


function eliminarEjercicio(req, res) {
    if (req.body.e) {
        return res.status(404).send({
            mensaje: "Error al buscar la informacion",
            error: req.body.e
        });
    }

    if (!req.body.ejercicios || !req.body.ejercicios.length) {
        return res.status(204).send({
            mensaje: "No hay informacion que mostrar"
        });
    }

    req.body.ejercicios[0].deleteOne()
        .then(info => {
            return res.status(200).send({
                mensaje: "Informacion eliminada con exito",
                info
            });
        })
        .catch(e => {
            return res.status(404).send({
                mensaje: "Error al eliminar la informacion",
                e
            });
        });
}

module.exports = {
    buscarTodo,
    guardarEjercicio,
    buscarEjercicio,
    mostrarEjercicio,
    actualizarEjercicio,
    eliminarEjercicio
};
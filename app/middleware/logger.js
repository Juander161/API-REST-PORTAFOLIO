const LogAcceso = require("../models/logAccesModel")

const logAccess = async (req, res, next) => {
  const originalSend = res.send

  res.send = function (data) {
    // Guardar log después de que se complete la respuesta
    const logData = {
      id_usuario: req.usuario ? req.usuario._id : null,
      endpoint: req.originalUrl,
      metodo: req.method,
      ip: req.ip || req.connection.remoteAddress,
      user_agent: req.get("User-Agent"),
      status_code: res.statusCode,
    }

    new LogAcceso(logData).save().catch((err) => {
      console.error("Error al guardar log de acceso:", err)
    })

    originalSend.call(this, data)
  }

  next()
}

module.exports = logAccess

require('dotenv').config()

module.exports = {
    PORT: process.env.PORT || 3000,
    DB: process.env.DB || "mongodb://localhost:27017/clinica_veterinaria",
    JWT_SECRET: process.env.JWT_SECRET || "mi_secreto_jwt_super_seguro_2024",
    JWT_EXPIRE: process.env.JWT_EXPIRE || "24h"
} 
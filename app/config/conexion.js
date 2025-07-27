const mongoose = require("mongoose") 
const config = require("./configuracion");

const conexion = {
    connection: null,
    connect: async () => {
        if(conexion.connection) return conexion.connection;
        
        try {
            const conn = await mongoose.connect(config.DB);
            conexion.connection = conn;
            console.log("✅ Conexión a MongoDB exitosa");
            return conn;
        } catch (error) {
            console.error("❌ Error de conexión a MongoDB:", error.message);
            throw error;
        }
    }
};

module.exports = conexion;
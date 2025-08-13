const mongoose = require("mongoose") 
const config = require("./configuracion");

const conexion = {
    connection: null,
    connect: async () => {
        if(conexion.connection) return conexion.connection;
        
        // Verificar que la configuración de DB esté disponible
        if (!config.DB) {
            throw new Error("❌ Error: La configuración de la base de datos (DB) no está definida");
        }
        
        console.log(`🔗 Intentando conectar a MongoDB: ${config.DB}`);
        
        try {
            const conn = await mongoose.connect(config.DB, {
                // Deshabilitar transacciones automáticas
                autoCreate: false,
                autoIndex: false,
                // Configuraciones adicionales para evitar transacciones
                readPreference: 'primary',
                retryWrites: false
            });
            
            // Deshabilitar transacciones globalmente
            mongoose.set('autoCreate', false);
            mongoose.set('autoIndex', false);
            
            conexion.connection = conn;
            console.log("✅ Conexión a MongoDB exitosa (sin transacciones)");
            return conn;
        } catch (error) {
            console.error("❌ Error de conexión a MongoDB:", error.message);
            throw error;
        }
    }
};

module.exports = conexion;
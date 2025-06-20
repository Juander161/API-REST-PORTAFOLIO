const mongoose = require("mongoose");
const config = require("./configuracion");

module.exports = {
    connecction: null,
    connect: () => {
        if(this.connecction) return this.connecction;
        return mongoose.connect(config.DB)
        .then(conn => {
            this.connecction = conn;
            console.log("conexion exitosa");
        })
        .catch(e => {
            console.log("error de conexion");
        });
    }
};
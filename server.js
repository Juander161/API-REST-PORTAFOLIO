const app = require("./app/app")
const config = require("./app/config/configuracion");


app.listen(config.PORT, () => {
    console.log("aplicación corriendo en puerto", config.PORT);
});


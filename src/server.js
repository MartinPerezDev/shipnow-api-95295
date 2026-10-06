import "dotenv/config";
import app from "./app.js";
//import connectDB from "./config/db.js";
import { config } from "./config/index.js";

//import logger from "./config/logger.js"


const PORT = config.port;

const startServer = async () => {
  try {
    //await connectDB();

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error(`Error al iniciar el servidor: ${error.message}`);
    //logger.error("Error interno del server", {message:error.message})
    process.exit(1);
  }
//logger.debug("prueba DEBUG")
//logger.http("prueba HTTP")
//logger.info("prueba Info")
};

startServer();

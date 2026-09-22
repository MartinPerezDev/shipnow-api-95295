import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./config/database.js";

import mocksRouter
    from "./routes/mocks.router.js";


dotenv.config();


const app = express();

const PORT =
    process.env.PORT || 8080;


// --------------------------------
// MIDDLEWARES
// --------------------------------

app.use(express.json());


// --------------------------------
// ROUTES
// --------------------------------

app.get("/", (req, res) => {

    res.json({
        status: "success",
        message: "ShipNow API funcionando"
    });
});


app.use(
    "/api/mocks",
    mocksRouter
);


// --------------------------------
// DATABASE
// --------------------------------

connectDB();


// --------------------------------
// SERVER
// --------------------------------

app.listen(
    PORT,
    () => {

        console.log(
            `Servidor escuchando en puerto ${PORT}`
        );
    }
);
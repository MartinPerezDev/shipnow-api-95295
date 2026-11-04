import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "FileManager API",
            version: "1.0.0",
            description: "API de gestión de usuarios, pedidos y archivos"
        },

        servers: [
            {
                url: "http://localhost:3000"
            }
        ],

        tags: [
            {
                name: "Users",
                description: "Operaciones de usuarios y sus documentos"
            },
            {
                name: "Orders",
                description: "Operaciones de pedidos y comprobantes"
            }
        ]
    },

    apis: ["./src/routes/*.js"]
};

export const swaggerSpec = swaggerJsdoc(options);
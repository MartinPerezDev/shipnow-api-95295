import "dotenv/config";

import { expect } from "chai";
import request from "supertest";
import mongoose from "mongoose";

import app from "../src/app.js";

describe("FileManager API - Integration Tests", function () {

    let userId;
    let orderId;

    before(async function () {
        await mongoose.connect(process.env.MONGO_URI_TEST);

        await mongoose.connection.dropDatabase();
    });

    after(async function () {
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
    });

    describe("GET /", function () {

        it("Debe responder que la API funciona", async function () {

            const response = await request(app).get("/");

            expect(response.status).to.equal(200);

            expect(response.body.message).to.equal(
                "FileManager API funcionando correctamente"
            );
        });
    });

    describe("POST /api/users", function () {

        it("Debe crear un usuario", async function () {

            const response = await request(app)
                .post("/api/users")
                .send({
                    name: "Juan Perez",
                    email: "juan@test.com"
                });

            expect(response.status).to.equal(201);

            expect(response.body.payload.email).to.equal(
                "juan@test.com"
            );

            userId = response.body.payload._id;
        });

        it("No debe permitir emails duplicados", async function () {

            const response = await request(app)
                .post("/api/users")
                .send({
                    name: "Otro Usuario",
                    email: "juan@test.com"
                });

            expect(response.status).to.equal(409);
        });
    });

    describe("POST /api/orders", function () {

        it("Debe crear un pedido asociado al usuario", async function () {

            const response = await request(app)
                .post("/api/orders")
                .send({
                    description: "Entrega de paquete",
                    user: userId
                });

            expect(response.status).to.equal(201);

            expect(response.body.payload.status).to.equal("PENDING");

            orderId = response.body.payload._id;
        });
    });

    describe("POST /api/users/:id/documents", function () {

        it("Debe permitir subir un documento PDF", async function () {

            const pdfBuffer = Buffer.from(
                "%PDF-1.4\nArchivo de prueba\n"
            );

            const response = await request(app)
                .post(`/api/users/${userId}/documents`)
                .attach("file", pdfBuffer, {
                    filename: "documento.pdf",
                    contentType: "application/pdf"
                });

            expect(response.status).to.equal(201);

            expect(response.body.payload.documents).to.have.length(1);

            expect(
                response.body.payload.documents[0].originalName
            ).to.equal("documento.pdf");
        });

        it("Debe rechazar formatos no permitidos", async function () {

            const response = await request(app)
                .post(`/api/users/${userId}/documents`)
                .attach("file", Buffer.from("archivo de prueba"), {
                    filename: "archivo.exe",
                    contentType: "application/octet-stream"
                });

            expect(response.status).to.equal(400);
        });

        it("Debe rechazar la petición si no se envía un archivo", async function () {

            const response = await request(app)
                .post(`/api/users/${userId}/documents`);

            expect(response.status).to.equal(400);
        });
    });

    describe("POST /api/orders/:id/proof", function () {

        it("Debe permitir subir un comprobante de entrega", async function () {

            const pdfBuffer = Buffer.from(
                "%PDF-1.4\nComprobante de prueba\n"
            );

            const response = await request(app)
                .post(`/api/orders/${orderId}/proof`)
                .attach("file", pdfBuffer, {
                    filename: "comprobante.pdf",
                    contentType: "application/pdf"
                });

            expect(response.status).to.equal(201);

            expect(response.body.payload.status).to.equal("DELIVERED");

            expect(response.body.payload.proof.originalName).to.equal(
                "comprobante.pdf"
            );
        });

        it("No debe permitir cargar otro comprobante si ya fue entregado", async function () {

            const pdfBuffer = Buffer.from(
                "%PDF-1.4\nSegundo comprobante\n"
            );

            const response = await request(app)
                .post(`/api/orders/${orderId}/proof`)
                .attach("file", pdfBuffer, {
                    filename: "segundo.pdf",
                    contentType: "application/pdf"
                });

            expect(response.status).to.equal(409);
        });
    });

});
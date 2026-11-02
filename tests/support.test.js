import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";

describe("Endpoints de soporte", () => {

  it("responde desde la ruta de logger", async() => {
    const response = await request(app).get("/loggerTest");

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.message).to.equal("Logs generados correctamente");
  });

  it("sirve el HTML de Swagger UI", async() => {
    const response = await request(app).get("/api/docs/");

    expect(response.status).to.equal(200);
    expect(response.headers["content-type"]).to.include("text/html");
    expect(response.text).to.include("swagger-ui");
  });

});

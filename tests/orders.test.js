import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";
import OrderModel from "../src/models/order.model.js";
import { orderFixture } from "./helpers/orderFixture.js";
import mongoose from "mongoose";

describe("Orders API", () => {

  it("crea y persiste un pedido valido", async()=> {
    const body = await orderFixture();

    const response = await request(app).post("/api/orders").send(body);

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload._id).to.be.a("string");
    expect(response.body.payload.total).to.equal(3000);
    expect(response.body.payload.status).to.equal("created");
    expect(response.body.payload.customer).to.equal(body.customer);
    expect(response.body.payload.store).to.equal(body.store);

    const saved = await OrderModel.findById(response.body.payload._id);
    expect(saved).to.not.equal(null);
    expect(saved.total).to.equal(3000);
    expect( await OrderModel.countDocuments() ).to.equal(1);
  });

  it("responde 404 si el pedido no existe", async() => {
    const id = new mongoose.Types.ObjectId().toString();
    const response = await request(app).get("/api/orders/"+id);

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("ORDER_NOT_FOUND");
    expect(response.body.message).to.equal("Pedido no encontrado");
  })

})
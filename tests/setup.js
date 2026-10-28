import { config } from "../src/config/index.js";
import mongoose from "mongoose";
import UserModel from "../src/models/user.model.js";
import StoreModel from "../src/models/store.model.js";
import OrderModel from "../src/models/order.model.js";

function testDatabase(){
  if(config.nodeEnv !== "test" || mongoose.connection.name !== "shipnow_95295_test"){
    throw new Error("No se pudo conectar a la base de datos");
  }
}

async function clean(){
  testDatabase();

  await UserModel.deleteMany({});
  await StoreModel.deleteMany({});
  await OrderModel.deleteMany({});
}

export const mochaHooks = {

  async beforeAll(){
    if(!config.mongoDbUri){
      throw new Error("Falta MONGODB_URI_TEST en .env");
    }
    
    await mongoose.connect(config.mongoDbUri);
    
    testDatabase();
  },

  async beforeEach(){
    await clean();
  },

  async afterAll(){
    await mongoose.disconnect();
  }

}
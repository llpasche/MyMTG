import { UserBusiness } from "./business/UserBusiness";
import { app } from "./controller/app";
import { UserController } from "./controller/UserController";
import { UserDatabase } from "./data/UserDatabase";
import { Authenticator } from "./services/Authenticator";
import { HashManager } from "./services/HashManager";
import { IdGenerator } from "./services/IdGenerator";

const userBusiness = new UserBusiness(
  new UserDatabase(),
  new IdGenerator(),
  new HashManager(),
  new Authenticator()
);

const userController = new UserController(userBusiness);

app.post("/signup", userController.signup);

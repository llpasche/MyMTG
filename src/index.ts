import { ListBusiness } from "./business/ListBusiness";
import { UserBusiness } from "./business/UserBusiness";
import { app } from "./controller/app";
import { ListController } from "./controller/ListController";
import { UserController } from "./controller/UserController";
import { ListDatabase } from "./data/ListDatabase";
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

const listBusiness = new ListBusiness(
  new ListDatabase(),
  new IdGenerator()
)

const authenticator = new Authenticator()
const userController = new UserController(userBusiness);
const listController = new ListController(listBusiness, authenticator)

app.post("/signup", userController.signup);
// app.post("/login", userController.login);
app.post("/list", listController.createList);

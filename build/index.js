"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserBusiness_1 = require("./business/UserBusiness");
const app_1 = require("./controller/app");
const UserController_1 = require("./controller/UserController");
const UserDatabase_1 = require("./data/UserDatabase");
const Authenticator_1 = require("./services/Authenticator");
const HashManager_1 = require("./services/HashManager");
const IdGenerator_1 = require("./services/IdGenerator");
const userBusiness = new UserBusiness_1.UserBusiness(new UserDatabase_1.UserDatabase(), new IdGenerator_1.IdGenerator(), new HashManager_1.HashManager(), new Authenticator_1.Authenticator());
const userController = new UserController_1.UserController(userBusiness);
app_1.app.post("/signup", userController.signup);
//# sourceMappingURL=index.js.map
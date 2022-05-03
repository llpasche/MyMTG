"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBusiness = void 0;
const User_1 = require("../model/User");
class UserBusiness {
    constructor(userDataBase, idGenerator, hashManager, authenticator) {
        this.userDataBase = userDataBase;
        this.idGenerator = idGenerator;
        this.hashManager = hashManager;
        this.authenticator = authenticator;
        this.signup = (input) => __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = input;
            if (!email || !name || !password) {
                throw new Error("Preencha todos os campos.");
            }
            const foundUser = yield this.userDataBase.getUserByEmail(email);
            if (foundUser) {
                throw new Error("Email já cadastrado.");
            }
            const id = this.idGenerator.generateId();
            const hashedPassword = yield this.hashManager.hash(password);
            const user = new User_1.User(id, name, email, hashedPassword);
            yield this.userDataBase.signup(user);
            const token = this.authenticator.generate({ id, hashedPassword });
            return token;
        });
    }
}
exports.UserBusiness = UserBusiness;
//# sourceMappingURL=UserBusiness.js.map
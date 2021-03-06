import { app } from "./controller/app";
import { CardBusiness } from "./business/CardBusiness";
import { CardListBusiness } from "./business/CardListBusiness";
import { ListBusiness } from "./business/ListBusiness";
import { UserBusiness } from "./business/UserBusiness";
import { CardController } from "./controller/CardController";
import { CardListController } from "./controller/CardListController";
import { ListController } from "./controller/ListController";
import { UserController } from "./controller/UserController";
import { CardDatabase } from "./data/CardDatabase";
import { CardListDatabase } from "./data/CardListDatabase";
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

const listBusiness = new ListBusiness(new ListDatabase(), new IdGenerator());

const cardBusiness = new CardBusiness(
  new CardDatabase(),
  new ListDatabase(),
  new CardListDatabase(),
  new IdGenerator(),
  new Authenticator()
);

const cardListBusiness = new CardListBusiness(
  new CardListDatabase(),
  new CardDatabase(),
  new ListDatabase(),
  new IdGenerator(),
  new Authenticator()
);

const authenticator = new Authenticator();
const userController = new UserController(userBusiness);
const listController = new ListController(listBusiness, authenticator);
const cardController = new CardController(cardBusiness, authenticator);
const cardListController = new CardListController(
  cardListBusiness,
  listBusiness,
  cardBusiness
);

app.post("/signup", userController.signup);
app.post("/login", userController.login);
app.post("/list", listController.createList);
app.post("/list/add", cardListController.insertIntoList);
app.post("/card", cardController.createCard);
app.get("/list", listController.getLists);
app.get("/card", cardController.getCardsByList);
app.patch("/list", cardController.updateQuantity);
app.patch("/list/price", cardController.updatePrice);
app.delete("/card/delete", cardListController.removeFromList);

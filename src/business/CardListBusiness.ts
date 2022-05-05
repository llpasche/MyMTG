import { CardDatabase } from "../data/CardDatabase";
import { CardListDatabase } from "../data/CardListDatabase";
import { ListDatabase } from "../data/ListDatabase";
import { CardListBond } from "../model/CardListBond";
import { IdGenerator } from "../services/IdGenerator";
import { cardListInputDTO } from "../types/DTO/cardListInputDTO";

export class CardListBusiness {
  constructor(
    private cardListDatabase: CardListDatabase,
    private cardDatabase: CardDatabase,
    private listDatabase: ListDatabase,
    private idGenerator: IdGenerator
  ) {}

  public inserIntoList = async (input: cardListInputDTO) => {
    const { cardId, listId } = input;
    const bondId = this.idGenerator.generateId();

    //Validação de preenchimento de dados
    if (!cardId || !listId) {
      throw new Error("Preencha todos os campos.");
    }

    //Validação de existência de carta
    const foundCard = await this.cardDatabase.getCardById(cardId);
    if (!foundCard) {
      throw new Error("Card inexistente.");
    }

    //Validação de existência de lista
    const foundList = await this.listDatabase.getListById(listId);
    if (!foundList) {
      throw new Error("Lista inexistente.");
    }

    const bond = new CardListBond(bondId, cardId, listId);
    await this.cardListDatabase.insertCard(bond);
  };


}

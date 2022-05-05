import { CardDatabase } from "../data/CardDatabase";
import { CardListDatabase } from "../data/CardListDatabase";
import { ListDatabase } from "../data/ListDatabase";
import { CardListBond } from "../model/CardListBond";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import { authenticationData } from "../types/authenticationData";
import { cardListInputDTO } from "../types/DTO/cardListInputDTO";
import { removeCardDTO } from "../types/DTO/removeCardDTO";

export class CardListBusiness {
  constructor(
    private cardListDatabase: CardListDatabase,
    private cardDatabase: CardDatabase,
    private listDatabase: ListDatabase,
    private idGenerator: IdGenerator,
    private authenticator: Authenticator
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

  public removeCard = async (
    input: removeCardDTO,
    token: string
  ): Promise<void> => {
    const { cardId, listId } = input;
    const userData: authenticationData = this.authenticator.getTokenData(token);

    //Autorização do usuário
    if (!token) {
      throw new Error("Usuário não autorizado.");
    }

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

    //Validação de pertencimento da carta à lista
    const isCardFromList = await this.cardListDatabase.hasCardVerifier(
      cardId,
      listId
    );
    if (!isCardFromList) {
      throw new Error("Este card não pertence a esta lista.");
    }

    await this.cardListDatabase.removeCard(cardId, listId, userData);
  };
}

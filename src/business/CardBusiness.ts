import { CardDatabase } from "../data/CardDatabase";
import { CardListDatabase } from "../data/CardListDatabase";
import { ListDatabase } from "../data/ListDatabase";
import { Card } from "../model/Card";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import { authenticationData } from "../types/authenticationData";
import { cardInputDTO } from "../types/DTO/cardInputDTO";
import { updateCardQuantityInputDTO } from "../types/DTO/updateCardInputDTO";
import { updateCardPriceInputDTO } from "../types/DTO/updateCardPriceInputDTO";

export class CardBusiness {
  constructor(
    private cardDatabase: CardDatabase,
    private listDatabase: ListDatabase,
    private cardListDatabase: CardListDatabase,
    private idGenerator: IdGenerator,
    private authenticator: Authenticator
  ) {}

  public createCard = async (input: cardInputDTO): Promise<void> => {
    const { name, edition, language, isFoil, price, quantity } = input;
    const id = this.idGenerator.generateId();

    //Validação de preenchimento de dados
    if (!name || !edition || !language || !price || !isFoil || !quantity) {
      throw new Error("Preencha todos os campos.");
    }

    const newCard = new Card(
      id,
      name,
      edition,
      language,
      isFoil,
      price,
      quantity
    );

    //Validação de carta única
    const card = await this.cardDatabase.uniqueCardVerifier(newCard);
    if (card) {
      throw new Error("Esta carta já foi cadastrada.");
    }

    await this.cardDatabase.createCard(newCard);
  };

  public retrieveCardName = async (id: string): Promise<string> => {
    const result = await this.cardDatabase.getCardName(id);

    return result;
  };

  public getCardsByList = async (
    id: string,
    orderParam: string
  ): Promise<Card[]> => {
    const result = await this.cardDatabase.getCardsByList(id, orderParam);

    return result;
  };

  public updateQuantity = async (
    input: updateCardQuantityInputDTO,
    userToken: string
  ): Promise<void> => {
    if (!userToken) {
      throw new Error("Token não enviado.");
    }
    if (!input.cardId || !input.listId || !input.quantity) {
      throw new Error("Preencha todos os campos.");
    }

    const foundCreator = await this.cardListDatabase.getCreatorByListId(
      input.listId
    );
    const userData: authenticationData =
      this.authenticator.getTokenData(userToken);

    //Verificação de existência da carta
    const foundCard = await this.cardDatabase.getCardById(input.cardId);
    if (!foundCard) {
      throw new Error("Carta inexistente.");
    }

    //Verificação de existência da lista
    const foundList = await this.listDatabase.getListById(input.listId);
    if (!foundList) {
      throw new Error("Lista inexistente.");
    }

    //Validação de pertencimento da carta à lista
    const isCardFromList = await this.cardListDatabase.hasCardVerifier(
      input.cardId,
      input.listId
    );
    if (!isCardFromList) {
      throw new Error("Esta carta não pertence a esta lista.");
    }

    //Autorização do usuário
    if (foundCreator.creator_id !== userData.id) {
      throw new Error("Usuário não autorizado.");
    }

    await this.cardDatabase.updateCardQuantity(
      input.cardId,
      input.quantity,
      input.listId,
      userData
    );
  };

  public updatePrice = async (
    input: updateCardPriceInputDTO,
    userToken: string
  ): Promise<void> => {
    if (!userToken) {
      throw new Error("Token não enviado.");
    }
    if (!input.cardId || !input.listId || !input.price) {
      throw new Error("Preencha todos os campos.");
    }
    if (!input.price.includes("R$")) {
      throw new Error("Insira o valor na formatação correta (R$<valor aqui>).");
    }

    const foundCreator = await this.cardListDatabase.getCreatorByListId(
      input.listId
    );
    const userData: authenticationData =
      this.authenticator.getTokenData(userToken);

    //Verificação de existência da carta
    const foundCard = await this.cardDatabase.getCardById(input.cardId);
    if (!foundCard) {
      throw new Error("Carta inexistente.");
    }

    //Verificação de existência da lista
    const foundList = await this.listDatabase.getListById(input.listId);
    if (!foundList) {
      throw new Error("Lista inexistente.");
    }

    //Validação de pertencimento da carta à lista
    const isCardFromList = await this.cardListDatabase.hasCardVerifier(
      input.cardId,
      input.listId
    );
    if (!isCardFromList) {
      throw new Error("Esta carta não pertence a esta lista.");
    }

    //Autorização do usuário
    if (foundCreator.creator_id !== userData.id) {
      throw new Error("Usuário não autorizado.");
    }

    await this.cardDatabase.updateCardPrice(
      input.cardId,
      input.price,
      input.listId,
      userData
    );
  };
}

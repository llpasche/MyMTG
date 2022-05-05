import { CardDatabase } from "../data/CardDatabase";
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
      throw new Error("Este card já foi cadastrado.");
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
      throw new Error("Usuário não autorizado.");
    }
    const userData: authenticationData =
      this.authenticator.getTokenData(userToken);
    await this.cardDatabase.updateCardQuantity(
      input.cardId,
      input.quantity,
      userData
    );
  };

  public updatePrice = async (
    input: updateCardPriceInputDTO,
    userToken: string
  ): Promise<void> => {
    if (!userToken) {
      throw new Error("Usuário não autorizado.");
    }
    if(!input.price.includes("R$")){
      throw new Error("Insira o valor na formatação correta (R$<valor aqui>).");      
    }
    const userData: authenticationData =
      this.authenticator.getTokenData(userToken);
    await this.cardDatabase.updateCardPrice(
      input.cardId,
      input.price,
      userData
    );
  };
}

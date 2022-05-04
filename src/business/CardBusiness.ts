import { CardDatabase } from "../data/CardDatabase";
import { Card } from "../model/Card";
import { IdGenerator } from "../services/IdGenerator";
import { cardInputDTO } from "../types/cardInputDTO";

export class CardBusiness {
  constructor(
    private cardDatabase: CardDatabase,
    private idGenerator: IdGenerator
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
      this.cardDatabase.updateCardQuantity(card);
    } else {
      await this.cardDatabase.createCard(newCard);
    }
  };
}

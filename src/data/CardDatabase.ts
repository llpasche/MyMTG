import { Card } from "../model/Card";
import { authenticationData } from "../types/authenticationData";
import { BaseDatabase } from "./BaseDatabase";

export class CardDatabase extends BaseDatabase {
  protected TABLE_NAME = "Cards";

  public createCard = async (card: Card): Promise<void> => {
    try {
      await this.connection(this.TABLE_NAME).insert({
        card_id: card.getId(),
        card_name: card.getName(),
        card_edition: card.getEdition(),
        card_language: card.getLanguage(),
        card_is_foil: card.getIsFoil(),
        card_price: card.getPrice(),
        card_quantity: card.getQuantity(),
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Erro no banco de dados.");
      }
    }
  };

  public uniqueCardVerifier = async (card: Card) => {
    try {
      const result = await this.connection(this.TABLE_NAME)
        .where("card_name", card.getName())
        .andWhere("card_edition", card.getEdition())
        .andWhere("card_language", card.getLanguage())
        .andWhere("card_is_foil", card.getIsFoil())
        .andWhere("card_price", card.getPrice());
      return result[0];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Erro no banco de dados.");
      }
    }
  };

  public updateCardQuantity = async (
    card: string,
    quantity: number,
    list: string,
    userData: authenticationData
  ) => {
    try {
      await this.connection("Lists")
        .where("creator_id", userData.id)
        .andWhere("Card_and_List.list_id", list)
        .join("Card_and_List", "Card_and_List.list_id", "Lists.list_id")
        .join(this.TABLE_NAME, "Cards.card_id", "Card_and_List.card_id")
        .update("Cards.card_quantity", quantity)
        .where("Cards.card_id", card);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Erro no banco de dados.");
      }
    }
  };

  public updateCardPrice = async (
    card: string,
    price: string,
    list: string,
    userData: authenticationData
  ) => {
    try {
      await this.connection("Lists")
        .where("creator_id", userData.id)
        .andWhere("Card_and_List.list_id", list)
        .join("Card_and_List", "Card_and_List.list_id", "Lists.list_id")
        .join(this.TABLE_NAME, "Cards.card_id", "Card_and_List.card_id")
        .update("Cards.card_price", price)
        .where("Cards.card_id", card);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Erro no banco de dados.");
      }
    }
  };

  public getCardById = async (id: string): Promise<Card> => {
    try {
      const [list] = await this.connection(this.TABLE_NAME).where("card_id", id);

      return list;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Erro no banco de dados.");
      }
    }
  };

  public getCardName = async (id: string) => {
    try {
      const [cardName] = await this.connection(this.TABLE_NAME)
        .select("card_name")
        .where("card_id", id);

      return cardName.card_name;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Erro no banco de dados.");
      }
    }
  };

  public getCardsByList = async (
    listId: string,
    orderParam: string
  ): Promise<any> => {
    try {
      let result;
      //Em "orderBy", o padrão é ascendente. Ascendente pra valores string é de A - Z, enquanto pra valores numéricos é do maior para o menor. A verificação a seguir garante que, ao selecionar uma ordenação ascendente, o primeiro valor numérico seja o mais baixo. Esta implementação pode ser facilmente removida e é apenas questão de preferência pessoal (faz mais sentido pra mim assim")
      switch (orderParam) {
        case "card_name":
          result = await this.connection(this.TABLE_NAME)
            .join("Card_and_List", "Card_and_List.card_id", "Cards.card_id")
            .where("Card_and_List.list_id", listId)
            .orderBy(orderParam);

          return result;

        case "card_price":
          result = await this.connection(this.TABLE_NAME)
            .join("Card_and_List", "Card_and_List.card_id", "Cards.card_id")
            .where("Card_and_List.list_id", listId)
            .orderBy(orderParam, "asc");

          return result;

        default:
          throw new Error("Parâmetro de ordenação inválido.");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Erro no banco de dados.");
      }
    }
  };
}

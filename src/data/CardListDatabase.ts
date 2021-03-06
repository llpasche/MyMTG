import { CardListBond } from "../model/CardListBond";
import { List } from "../model/List";
import { authenticationData } from "../types/authenticationData";
import { BaseDatabase } from "./BaseDatabase";

export class CardListDatabase extends BaseDatabase {
  protected TABLE_NAME = "Card_and_List";

  public insertCard = async (bond: CardListBond): Promise<void> => {
    try {
      await this.connection(this.TABLE_NAME).insert({
        bond_id: bond.getBondId(),
        card_id: bond.getCardId(),
        list_id: bond.getlistId(),
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Erro no banco de dados.");
      }
    }
  };

  public removeCard = async (
    cardId: string,
    listId: string,
    userData: authenticationData
  ): Promise<void> => {
    try {
      await this.connection(this.TABLE_NAME)
        .join("Lists", "Lists.list_id", "Card_and_List.list_id")
        .where("creator_id", userData.id)
        .andWhere("card_id", cardId)
        .andWhere("Card_and_List.list_id", listId)
        .del();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Erro no banco de dados.");
      }
    }
  };

  public hasCardVerifier = async (cardId: string, listId: string) => {
    try {
      const [result] = await this.connection(this.TABLE_NAME)
        .where("list_id", listId)
        .andWhere("card_id", cardId);

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Erro no banco de dados.");
      }
    }
  };

  public getCreatorByListId = async (listId: string) => {
    try {
      const [result] = await this.connection(this.TABLE_NAME)
        .join("Lists", "Lists.list_id", "Card_and_List.list_id")
        .where("Lists.list_id", listId)
        .select("creator_id");

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Erro no banco de dados.");
      }
    }
  };
}

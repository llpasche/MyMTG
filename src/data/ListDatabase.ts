import { List } from "../model/List";
import { BaseDatabase } from "./BaseDatabase";

export class ListDatabase extends BaseDatabase {
  protected TABLE_NAME = "Lists";

  public createList = async (list: List): Promise<void> => {
    try {
      await this.connection(this.TABLE_NAME).insert({
        list_id: list.getId(),
        list_name: list.getName(),
        creator_id: list.getCreatorId(),
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Erro no banco de dados.");
      }
    }
  };

  public getListByName = async (name: string): Promise<List> => {
    try {
      const [list] = await this.connection(this.TABLE_NAME).where(
        "list_name",
        name
      );

      return list;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Erro no banco de dados.");
      }
    }
  };

  public getListById = async (id: string): Promise<List> => {
    try {
      const [list] = await this.connection(this.TABLE_NAME).where(
        "list_id",
        id
      );

      return list;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Erro no banco de dados.");
      }
    }
  };

  public getListName = async (id: string) => {
    try {
      const [listName] = await this.connection(this.TABLE_NAME)
        .select("list_name")
        .where("list_id", id);

      return listName.list_name;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Erro no banco de dados.");
      }
    }
  };

  public getLists = async () => {
    const lists = await this.connection(this.TABLE_NAME);
    const listsArray = [];

    for (let list of lists) {
      const cards = await this.connection("Card_and_List")
        .join("Cards", "Cards.card_id", "Card_and_List.card_id")
        .where("list_id", list.list_id)
        .select("Cards.card_id", "Cards.card_name");

      list = {
        ...list,
        cards,
      };

      listsArray.push(list);
    }

    return listsArray;
  };
}

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
      const list = await this.connection(this.TABLE_NAME).where(
        "list_name",
        name
      );

      return list[0];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Erro no banco de dados.");
      }
    }
  };
}

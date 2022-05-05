import { CardListBond } from "../model/CardListBond";
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
}

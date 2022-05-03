import { User } from "../model/User";
import { getUserByEmailResponse } from "../types/getUserByEmailResponse";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
  protected TABLE_NAME = "users";

  public signup = async (user: User): Promise<void> => {
    try {
      await this.connection(this.TABLE_NAME).insert({user});
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("kkkkk");
      } else {
        throw new Error("Erro no banco de dados.");
      }
    }
  };

  public getUserByEmail = async (email: string) => {
    try {
      const result: getUserByEmailResponse = await this.connection(
        this.TABLE_NAME
      ).where({ email });

      return result[0];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Erro no banco de dados.");
      }
    }
  };
}

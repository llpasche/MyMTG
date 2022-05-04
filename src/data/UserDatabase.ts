import { User } from "../model/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
  protected TABLE_NAME = "Users";

  public signup = async (user: User): Promise<void> => {
    try {
      await this.connection(this.TABLE_NAME).insert({
        user_id: user.getId(),
        user_name: user.getName(),
        user_email: user.getEmail(),
        user_password: user.getPassword(),
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Erro no banco de dados.");
      }
    }
  };

  public getUserByEmail = async (email: string) => {
    try {
      const result = await this.connection(this.TABLE_NAME).where(
        "user_email",
        email
      );

      return result[0];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Erro no banco de dados.");
      }
    }
  };

  public getUserById = async (id: string) => {
    try {
      const result = await this.connection(this.TABLE_NAME).where(
        "user_id",
        id
      );
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

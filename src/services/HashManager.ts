import * as bcrypt from "bcryptjs";

export class HashManager {
  public hash = async (text: string): Promise<string> => {
    const rounds = Number(process.env.BCRYPT_COST);
    const salt = await bcrypt.genSalt(rounds);

    return bcrypt.hash(text, salt);
  };

  public compare = async (text: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(text, hash)
  }
}

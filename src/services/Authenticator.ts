import * as jwt from "jsonwebtoken";
import { authenticationData } from "../types/authenticationData";

export class Authenticator {
  public generate = (input: authenticationData): string => {
    const token = jwt.sign(input, String(process.env.JWT_KEY), {
      expiresIn: process.env.EXPIRES_IN,
    });
    return token;
  };

  public getTokenData = (token: string): authenticationData => {
    const data = jwt.verify(token, String(process.env.JWT_KEY));
    return data as authenticationData;
  };
}

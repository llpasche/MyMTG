import { CARD_LANGUAGE } from "../types/ENUM/CARD_LANGUAGE";
import { IS_FOIL } from "../types/ENUM/IS_FOIL";

export class Card {
  constructor(
    private id: string,
    private name: string,
    private edition: string,
    private language: CARD_LANGUAGE,
    private isFoil: IS_FOIL,
    private price: string,
    private quantity: number
  ) {}
  public getId = () => {
    return this.id;
  };
  public getName = () => {
    return this.name;
  };
  public getEdition = () => {
    return this.edition;
  };
  public getLanguage = () => {
    return this.language;
  };
  public getIsFoil = () => {
    return this.isFoil;
  };
  public getPrice = () => {
    return this.price;
  };
  public getQuantity = () => {
    return this.quantity;
  };
}

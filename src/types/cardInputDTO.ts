import { CARD_LANGUAGE } from "./CARD_LANGUAGE";
import { IS_FOIL } from "./IS_FOIL";

export type cardInputDTO = {
  name: string;
  edition: string;
  language: CARD_LANGUAGE;
  isFoil: IS_FOIL;
  price: string;
  quantity: number;
};

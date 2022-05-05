import { Request, Response } from "express";
import { CardBusiness } from "../business/CardBusiness";
import { cardInputDTO } from "../types/DTO/cardInputDTO";

export class CardController {
  constructor(private cardBusiness: CardBusiness) {}
  public createCard = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, edition, language, isFoil, price, quantity } = req.body;
      const input: cardInputDTO = {
        name,
        edition,
        language,
        isFoil,
        price,
        quantity,
      };

      await this.cardBusiness.createCard(input);

      res.status(201).send("Card criado com sucesso!")
    } catch (error: any) {
      switch (error.message) {
        case "Preencha todos os campos.":
          res.status(422).send(error.message);
          break;
        case "O campo 'card_is_foil' deve ser preenchido com 'true' ou 'false'.":
          res.status(422).send(error.message);
          break;
        default:
          res.status(500).send("Erro do servidor.");
      }
    }
  };
}

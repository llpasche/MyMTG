import { Request, Response } from "express";
import { CardBusiness } from "../business/CardBusiness";
import { CardListBusiness } from "../business/CardListBusiness";
import { ListBusiness } from "../business/ListBusiness";
import { cardListInputDTO } from "../types/DTO/cardListInputDTO";

export class CardListController {
  constructor(
    private cardListBusiness: CardListBusiness,
    private listBusiness: ListBusiness,
    private cardBusiness: CardBusiness
  ) {}

  public insertIntoList = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { cardId, listId } = req.body;
      const input: cardListInputDTO = {
        cardId,
        listId,
      };

      await this.cardListBusiness.inserIntoList(input);

      const listName = await this.listBusiness.retrieveListName(listId);
      const cardName = await this.cardBusiness.retrieveCardName(cardId);

      res
        .status(201)
        .send(`Card "${cardName}" adicionado à coleção "${listName}"!`);
    } catch (error: any) {
      switch (error.message) {
        case "Preencha todos os campos.":
          res.status(422).send(error.message);
          break;
        case "Card inexistente.":
          res.status(403).send(error.message);
          break;
        case "Lista inexistente.":
          res.status(422).send(error.message);
          break;
        case "Erro no banco de dados":
          res.status(500).send(error.message);
          break;
        default:
          res.status(500).send("Erro do servidor.");
      }
    }
  };
}

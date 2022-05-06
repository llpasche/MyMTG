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
          res.status(404).send(error.message);
          break;
        case "Lista inexistente.":
          res.status(404).send(error.message);
          break;
        case "Erro no banco de dados":
          res.status(500).send(error.message);
          break;
        default:
          res.status(500).send("Erro do servidor.");
      }
    }
  };

  public removeFromList = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { cardId, listId } = req.body;
      const token = req.headers.authorization as string;

      const input: cardListInputDTO = {
        cardId,
        listId,
      };

      await this.cardListBusiness.removeCard(input, token);

      const listName = await this.listBusiness.retrieveListName(listId);
      const cardName = await this.cardBusiness.retrieveCardName(cardId);

      res
        .status(200)
        .send(`"${cardName}" removido de "${listName}" com sucesso!`);
    } catch (error: any) {
      switch (error.message) {
        case "Token não enviado":
          res.status(401).send(error.message);
          break;
        case "Preencha todos os campos.":
          res.status(422).send(error.message);
          break;
        case "Card inexistente.":
          res.status(404).send(error.message);
          break;
        case "Lista inexistente.":
          res.status(404).send(error.message);
          break;
        case "Esta carta não pertence a esta lista.":
          res.status(422).send(error.message);
          break;
        case "Usuário não autorizado.":
          res.status(403).send(error.message);
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

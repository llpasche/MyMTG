import { Request, Response } from "express";
import { CardBusiness } from "../business/CardBusiness";
import { Authenticator } from "../services/Authenticator";
import { cardInputDTO } from "../types/DTO/cardInputDTO";
import { updateCardQuantityInputDTO } from "../types/DTO/updateCardInputDTO";
import { updateCardPriceInputDTO } from "../types/DTO/updateCardPriceInputDTO";

export class CardController {
  constructor(
    private cardBusiness: CardBusiness,
    private authenticator: Authenticator
  ) {}
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

      res.status(201).send("Card criado com sucesso!");
    } catch (error: any) {
      switch (error.message) {
        case "Preencha todos os campos.":
          res.status(422).send(error.message);
          break;
        case "Este card já foi cadastrado.":
          res.status(422).send(error.message);
          break;
        case "Erro no banco de dados.":
          res.status(500).send(error.message);
          break;
        default:
          res.status(500).send("Erro do servidor.");
      }
    }
  };

  public getCardsByList = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const listId = req.query.list as string;
      const orderParam = req.query.orderBy as string;
      const result = await this.cardBusiness.getCardsByList(listId, orderParam);

      res.status(200).send(result);
    } catch (error: any) {
      switch (error.message) {
        case "Parâmetro de ordenação inválido.":
          res.status(422).send(error.message);
          break;
        case "Erro no banco de dados.":
          res.status(500).send(error.message);
          break;
        default:
          res.status(500).send("Erro do servidor.");
      }
    }
  };

  public updateQuantity = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const cardId = req.query.card as string;
      const {quantity} = req.body;
      const token = req.headers.authorization as string;
      const input: updateCardQuantityInputDTO = {
        cardId,
        quantity,
      };
      await this.cardBusiness.updateQuantity(input, token);

      res.status(200).send(`Quantidade atualizada para ${quantity}!`)
    } catch (error: any) {
      switch (error.message) {
        case "Usuário não autorizado.":
          res.status(403).send(error.message);
          break;
        case "Erro no banco de dados.":
          res.status(500).send(error.message);
          break;
        default:
          res.status(500).send("Erro do servidor.");
      }
    }
  };
  public updatePrice = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const cardId = req.query.card as string;
      const {price} = req.body;
      const token = req.headers.authorization as string;
      const input: updateCardPriceInputDTO = {
        cardId,
        price,
      };
      await this.cardBusiness.updatePrice(input, token);

      res.status(200).send(`Valor atualizado para ${price}!`)
    } catch (error: any) {
      switch (error.message) {
        case "Usuário não autorizado.":
          res.status(403).send(error.message);
          break;
        case "Insira o valor na formatação correta (R$<valor aqui>).":
          res.status(403).send(error.message);
          break;
        case "Erro no banco de dados.":
          res.status(500).send(error.message);
          break;
        default:
          res.status(500).send("Erro do servidor.");
      }
    }
  };
}

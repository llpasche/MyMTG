import { Request, Response } from "express";
import { ListBusiness } from "../business/ListBusiness";
import { Authenticator } from "../services/Authenticator";
import { listInputDTO } from "../types/DTO/listInputDTO";

export class ListController {
  constructor(
    private listBusiness: ListBusiness,
    private authenticator: Authenticator
  ) {}

  public createList = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.body;
      const token = req.headers.authorization as string;
      const creatorData = this.authenticator.getTokenData(token);
      const creatorId = creatorData.id;

      const input: listInputDTO = {
        name,
        creatorId,
      };

      await this.listBusiness.createList(input);

      res.status(201).send("Lista criada!");
    } catch (error: any) {
      switch (error.message) {
        case "Preencha todos os campos.":
          res.status(422).send(error.message);
          break;
        case "Usuário não autorizado.":
          res.status(403).send(error.message);
          break;
        case "Uma lista já foi criada com este nome.":
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

  public getLists = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.listBusiness.getLists();

      res.status(200).send(result);
    } catch (error) {
      res.status(500).send("Erro do servidor.");
    }
  };
}

import { ListDatabase } from "../data/ListDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { listInputDTO } from "../types/DTO/listInputDTO";
import { List } from "../model/List";

export class ListBusiness {
  constructor(
    private listDatabase: ListDatabase,
    private idGenerator: IdGenerator
  ) {}

  public createList = async (input: listInputDTO): Promise<void> => {
    const { name, creatorId } = input;
    const id = this.idGenerator.generateId();
    
    //Validação de preenchimento de dados e autorização
    if (!name ) {
      throw new Error("Preencha todos os campos.");
    }
    if (!creatorId ) {
      throw new Error("Usuário não autorizado.");
    }

    //Validação de nome único
    const foundList = await this.listDatabase.getListByName(name);
    if (foundList) {
      throw new Error("Uma lista já foi criada com este nome.");
    }

    const list = new List(id, name, creatorId);

    await this.listDatabase.createList(list);
  };

  public retrieveListName = async (id: string) => {
    const result = await this.listDatabase.getListName(id);

    return result
  }
}

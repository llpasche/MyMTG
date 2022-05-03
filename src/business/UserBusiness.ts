import { UserDatabase } from "../data/UserDatabase";
import { User } from "../model/User";
import { Authenticator } from "../services/Authenticator";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { SignupInputDTO } from "../types/signupInputDTO";

export class UserBusiness {
  constructor(
    private userDataBase: UserDatabase,
    private idGenerator: IdGenerator,
    private hashManager: HashManager,
    private authenticator: Authenticator
  ) {}
  public signup = async (input: SignupInputDTO): Promise<string> => {
    const { name, email, password } = input;

    //Validação de preenchimento de dados
    if (!email || !name || !password) {
      throw new Error("Preencha todos os campos.");
    }

    //Validação de uso de email único
    const foundUser = await this.userDataBase.getUserByEmail(email);
    if (foundUser) {
      throw new Error("Email já cadastrado.");
    }

    const id = this.idGenerator.generateId();
    const hashedPassword = await this.hashManager.hash(password);
    const user = new User(
        id, name, email, hashedPassword
    )


    await this.userDataBase.signup(user)

    const token: string = this.authenticator.generate({id, hashedPassword})

    return token
  };
}

import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { SignupInputDTO } from "../types/signupInputDTO";

export class UserController {
  constructor(private userBusiness: UserBusiness) {}
  public signup = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;
    const input: SignupInputDTO = {
      name,
      email,
      password,
    };

    try {
      const token: string = await this.userBusiness.signup(input);
      res
        .status(201)
        .send({ message: "Usuário cadastrado com sucesso!", token: token });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send(error.message);
      }
      res.status(500).send("Erro no servidor.");
    }
  };
}

import { User } from "@prisma/client";
import { IGetUserByEmailRepository } from "../../repositories/user/get-user-by-email";


export interface IGetUserByEmailService {
  execute(email: string): Promise<User | null>;
}

export class GetUserByEmailService implements IGetUserByEmailService {
  constructor(private getUserByEmailRepository: IGetUserByEmailRepository) {}

  async execute(email: string) {
    const user = await this.getUserByEmailRepository.execute(email);

    return user;
  }
}
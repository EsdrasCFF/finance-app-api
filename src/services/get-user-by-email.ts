import { GetUserByEmailRepository } from "../repositories/get-user-by-email";

export class GetUserByEmailService {
  async execute(email: string) {
    const getUserByEmailRepository = new GetUserByEmailRepository();
    const user = await getUserByEmailRepository.execute(email);

    return user;
  }
}

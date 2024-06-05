import { GetUserByIdRepository } from "../repositories/get-user-by-id";

export class GetUserByIdService {
  async execute(userId: string) {
    const getUserByIdRepository = new GetUserByIdRepository();

    const user = await getUserByIdRepository.execute(userId);

    return user;
  }
}

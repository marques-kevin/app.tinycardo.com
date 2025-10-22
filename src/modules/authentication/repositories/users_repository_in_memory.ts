import type { UserEntity } from "@/modules/authentication/entities/user_entity"
import type { UsersRepository } from "@/modules/authentication/repositories/users_repository"

export class UsersRepositoryInMemory implements UsersRepository {
  private authenticated_user: UserEntity | null = null

  constructor(params?: { user?: UserEntity | null }) {
    this.authenticated_user = params?.user ?? null
  }

  async get_google_authentication_url(): ReturnType<
    UsersRepository["get_google_authentication_url"]
  > {
    return "https://www.google.com"
  }

  async post_google_authentication_code(): ReturnType<
    UsersRepository["post_google_authentication_code"]
  > {
    return { user_id: "1", jwt: "test_jwt" }
  }

  async get_authenticated_user(): ReturnType<
    UsersRepository["get_authenticated_user"]
  > {
    return this.authenticated_user
  }
}

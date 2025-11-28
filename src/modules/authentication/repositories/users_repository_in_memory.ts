import type { UserEntity } from "@/modules/authentication/entities/user_entity"
import type { UsersRepository } from "@/modules/authentication/repositories/users_repository"

export class UsersRepositoryInMemory implements UsersRepository {
  private authenticated_user: UserEntity | null = null
  private is_premium: boolean = false

  constructor(params?: { user?: UserEntity | null; is_premium?: boolean }) {
    this.authenticated_user = params?.user ?? null
    this.is_premium = params?.is_premium ?? false
  }

  async set_authenticated_user(user: UserEntity | null): Promise<void> {
    this.authenticated_user = user
  }

  async set_is_user_premium(is_premium: boolean): Promise<void> {
    this.is_premium = is_premium
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

  async is_user_premium(): ReturnType<UsersRepository["is_user_premium"]> {
    return this.is_premium
  }
}

import type { UsersRepository } from "@/modules/authentication/repositories/users_repository"
import { ApiService } from "@/modules/global/services/api_service/api_service"
import type { paths } from "@/types/api"

export class UsersRepositoryApi implements UsersRepository {
  private readonly api_service: ApiService

  constructor() {
    this.api_service = new ApiService()
  }

  async get_google_authentication_url(params: {
    callback_url: string
  }): ReturnType<UsersRepository["get_google_authentication_url"]> {
    const data = await this.api_service.post<{ url: string }>(
      "/authentication/get_google_authentication_url",
      params,
    )

    return data.url
  }

  async post_google_authentication_code(params: {
    code: string
    callback_url: string
  }): ReturnType<UsersRepository["post_google_authentication_code"]> {
    const data = await this.api_service.post<{
      access_token: string
      id: string
    }>("/authentication/authenticate_with_google_code", params)

    return { user_id: data.id, jwt: data.access_token }
  }

  async get_authenticated_user(): ReturnType<
    UsersRepository["get_authenticated_user"]
  > {
    try {
      const data = await this.api_service.post<{
        id: string
        email: string
      }>("/authentication/get_authenticated_user_infos", {})

      return data
    } catch {
      return null
    }
  }

  async is_user_premium(): ReturnType<UsersRepository["is_user_premium"]> {
    const data = await this.api_service.post<
      paths["/authentication/is_premium"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/authentication/is_premium", {})

    return Boolean(data.is_premium)
  }
}

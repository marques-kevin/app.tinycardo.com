import type { UserEntity } from "@/modules/authentication/entities/user_entity"

export interface UsersRepository {
  get_google_authentication_url(params: {
    callback_url: string
  }): Promise<string>
  post_google_authentication_code(params: {
    code: string
    callback_url: string
  }): Promise<{ user_id: string; jwt: string }>
  get_authenticated_user(): Promise<UserEntity | null>
  is_user_premium(): Promise<boolean>
}

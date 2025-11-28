import type { AsyncThunkConfig } from "@/redux/store"
import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
import type { UserEntity } from "@/modules/authentication/entities/user_entity"
import { AUTHENTICATION_CALLBACK_URL } from "@/modules/authentication/configuration/authentication_google_config"
import { LOCAL_STORAGE_KEYS } from "@/modules/global/services/localstorage_service/localstorage_service"
import { global_app_user_authenticated } from "@/modules/global/redux/global_actions"

export const _store_user = createAction<{ user: UserEntity | null }>(
  "authentication/store_user",
)

export const _store_is_user_premium = createAction<{
  is_user_premium: boolean
}>("authentication/store_is_user_premium")

export const go_on_google_authentication_page = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>("authentication/authenticate_with_google", async (_, { extra }) => {
  const domain = extra.location_service.get_domain()
  const url = await extra.users_repository.get_google_authentication_url({
    callback_url: `${domain}${AUTHENTICATION_CALLBACK_URL}`,
  })
  extra.location_service.navigate(url)
})

export const send_google_authentication_code = createAsyncThunk<
  void,
  { code: string; callback_url: string },
  AsyncThunkConfig
>(
  "authentication/send_google_authentication_code",
  async (params, { dispatch, extra }) => {
    const { jwt } =
      await extra.users_repository.post_google_authentication_code(params)

    extra.local_storage_service.set(LOCAL_STORAGE_KEYS.jwt, jwt)
    extra.location_service.navigate("/")

    dispatch(is_authenticated())
  },
)

export const is_authenticated = createAsyncThunk<void, void, AsyncThunkConfig>(
  "authentication/is_authenticated",
  async (_, { dispatch, extra }) => {
    const user = await extra.users_repository.get_authenticated_user()

    dispatch(_store_user({ user }))

    if (user) {
      await dispatch(fetch_is_user_premium())
      await dispatch(global_app_user_authenticated())
    }
  },
)

export const fetch_is_user_premium = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>("authentication/fetch_is_user_premium", async (_, { dispatch, extra }) => {
  const is_user_premium = await extra.users_repository.is_user_premium()
  dispatch(_store_is_user_premium({ is_user_premium }))
})

export const global_app_initialized = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>("authentication/global_app_initialized", async (_, { dispatch, extra }) => {
  const url = extra.location_service.get_current_url()
  const domain = extra.location_service.get_domain()
  const params = new URL(url)
  const code = params.searchParams.get("code")

  if (url.includes("authentication/google/callback") && code) {
    dispatch(
      send_google_authentication_code({
        code: code,
        callback_url: `${domain}${AUTHENTICATION_CALLBACK_URL}`,
      }),
    )
  }

  await dispatch(is_authenticated())
})

export const logout = createAsyncThunk<void, void, AsyncThunkConfig>(
  "authentication/logout",
  async (_, { extra }) => {
    extra.local_storage_service.delete(LOCAL_STORAGE_KEYS.jwt)
    extra.location_service.navigate("/")
  },
)

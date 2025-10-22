import * as authentication_actions from "@/modules/authentication/redux/authentication_actions"
import { useAppDispatch, useAppSelector } from "@/redux/store"

export function AuthenticationButton() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.authentication)

  const on_login_click = () => {
    dispatch(authentication_actions.go_on_google_authentication_page())
  }

  const on_logout_click = () => {
    dispatch(authentication_actions.logout())
  }

  return (
    <button
      className="btn btn-primary"
      onClick={user ? on_logout_click : on_login_click}
    >
      {user ? "Logout" : "Login"}
    </button>
  )
}

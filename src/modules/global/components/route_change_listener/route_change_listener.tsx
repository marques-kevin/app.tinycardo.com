import { global_route_changed } from "@/modules/global/redux/global_actions"
import { useAppDispatch } from "@/redux/store"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export function RouteChangeListener() {
  const location = useLocation()
  const dispatch = useAppDispatch()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    dispatch(global_route_changed())

    const handle_pop_state = () => {
      dispatch(global_route_changed())
    }

    window.addEventListener("popstate", handle_pop_state)

    return () => {
      window.removeEventListener("popstate", handle_pop_state)
    }
  }, [location.pathname, location.search, location.hash])

  return null
}

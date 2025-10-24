import { global_route_changed } from "@/modules/global/redux/global_actions"
import { useAppDispatch } from "@/redux/store"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export function RouteChangeListener() {
  const location = useLocation()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(global_route_changed())
  }, [location.pathname, location.search, location.hash, dispatch])

  return null
}

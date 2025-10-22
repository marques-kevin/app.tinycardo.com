import { type Dependencies } from "@/redux/dependencies"
import { configureStore } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"
import { reducers } from "@/redux/reducers"
import { global_app_initialized } from "@/modules/global/redux/global_actions"
import { redux_catch_errors_middleware } from "@/redux/middlewares/redux_catch_errors_middleware/redux_catch_errors_middleware"

export const init = (initialState = {}, dependencies: Dependencies) => {
  const store = configureStore({
    reducer: reducers,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        thunk: {
          extraArgument: dependencies,
        },
      }).concat(redux_catch_errors_middleware),
  })

  store.dispatch(global_app_initialized())

  return { store }
}

export type RootState = ReturnType<typeof reducers>
export type Dispatch = ReturnType<typeof init>["store"]["dispatch"]
export type AsyncThunkConfig = {
  state: RootState
  dispatch: Dispatch
  extra: Dependencies
}

export const useAppDispatch = () => useDispatch<Dispatch>()
export const useAppSelector: <T>(selector: (state: RootState) => T) => T =
  useSelector

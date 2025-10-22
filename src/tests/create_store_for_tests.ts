import { build_dependencies } from "@/redux/dependencies"
import { init as createStore } from "@/redux/store"

export const create_store_for_tests = async () => {
  const dependencies = build_dependencies("test")
  const { store } = createStore({}, dependencies)

  return {
    store,
    dependencies,
  }
}

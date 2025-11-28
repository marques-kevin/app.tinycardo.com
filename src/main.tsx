import "@/css/index.css"

import App from "@/App.tsx"
import { build_dependencies } from "@/redux/dependencies"
import { init } from "@/redux/store"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { init_sentry } from "@/lib/sentry"

init_sentry()

const mode = (import.meta.env.MODE ?? "development") as
  | "development"
  | "production"

const dependencies = build_dependencies(mode)

const { store } = init({}, dependencies)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)

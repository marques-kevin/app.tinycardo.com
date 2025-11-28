import * as Sentry from "@sentry/react"

const dsn = import.meta.env.VITE_SENTRY_DSN

export const init_sentry = () => {
  if (!dsn) return

  Sentry.init({
    dsn,
    sendDefaultPii: true,
  })
}

import { Dialog } from "@/modules/dialog/components/dialog/dialog"
import { LanguageIntlProvider } from "@/modules/language/components/language_intl_provider/language_intl_provider"
import { AuthenticationProtection } from "@/modules/authentication/components/authentication_protection/authentication_protection"
import { DialogCrashError } from "@/modules/dialog/components/dialog_crash_error/dialog_crash_error"
import { Routes } from "@/routes"
import { Toaster } from "sonner"
import { StreakModal } from "@/modules/streak/components/streak-modal/streak_modal"
import { GlobalReactScan } from "@/modules/global/components/global_react_scan/global_react_scan"
import { GlobalErrorCrashPage } from "@/modules/global/components/global_error_crash_page/global_error_crash_page"
import { ErrorBoundary } from "@sentry/react"

function App() {
  return (
    <LanguageIntlProvider>
      <ErrorBoundary
        fallback={({ error, resetError }) => (
          <GlobalErrorCrashPage
            error={error instanceof Error ? error : undefined}
            resetError={resetError}
          />
        )}
      >
        <AuthenticationProtection>
          <Routes />
          <Dialog />
          <DialogCrashError />
          <Toaster position="top-center" duration={3000} />
          <StreakModal />
          <GlobalReactScan />
        </AuthenticationProtection>
      </ErrorBoundary>
    </LanguageIntlProvider>
  )
}

// eslint-disable-next-line no-restricted-exports
export default App

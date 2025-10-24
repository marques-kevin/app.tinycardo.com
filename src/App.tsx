import { Dialog } from "@/modules/dialog/components/dialog/dialog"
import { LanguageIntlProvider } from "@/modules/language/components/language_intl_provider/language_intl_provider"
import { AuthenticationProtection } from "@/modules/authentication/components/authentication_protection/authentication_protection"
import { DialogCrashError } from "./modules/dialog/components/dialog_crash_error/dialog_crash_error"
import { Routes } from "@/routes"

function App() {
  return (
    <LanguageIntlProvider>
      <AuthenticationProtection>
        <Routes />
        <Dialog />
        <DialogCrashError />
      </AuthenticationProtection>
    </LanguageIntlProvider>
  )
}

// eslint-disable-next-line no-restricted-exports
export default App

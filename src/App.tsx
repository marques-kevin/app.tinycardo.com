import { DecksListPage } from "@/modules/decks/pages/decks_list_page"
import { Dialog } from "@/modules/dialog/components/dialog/dialog"
import { RouteChangeListener } from "@/modules/global/components/route_change_listener/route_change_listener"
import { LanguageIntlProvider } from "@/modules/language/components/language_intl_provider/language_intl_provider"
import { SessionPage } from "@/modules/sessions/pages/session_page"
import { Route, BrowserRouter, Routes } from "react-router-dom"
import { ParamsPage } from "@/modules/params/pages/params_page"
import { CreateDeckPage } from "@/modules/decks/pages/create_deck_page"
import { DeckDetailsPage } from "@/modules/decks/pages/deck_details_page"
import { AuthenticationProtection } from "@/modules/authentication/components/authentication_protection/authentication_protection"
import { DialogCrashError } from "./modules/dialog/components/dialog_crash_error/dialog_crash_error"
import { GlobalFooter } from "./modules/global/components/global_footer/global_footer"

function App() {
  return (
    <LanguageIntlProvider>
      <AuthenticationProtection>
        <BrowserRouter>
          <RouteChangeListener />
          <Routes>
            <Route path="/" element={<DecksListPage />} />
            <Route path="/params" element={<ParamsPage />} />
            <Route path="/decks/:deck_id/update" element={<CreateDeckPage />} />
            <Route
              path="/decks/:deck_id/details"
              element={<DeckDetailsPage />}
            />
            <Route path="/create_new_deck" element={<CreateDeckPage />} />
            <Route path="/sessions/:deck_id/:mode" element={<SessionPage />} />
          </Routes>
          <GlobalFooter />
        </BrowserRouter>
        <Dialog />
        <DialogCrashError />
      </AuthenticationProtection>
    </LanguageIntlProvider>
  )
}

// eslint-disable-next-line no-restricted-exports
export default App

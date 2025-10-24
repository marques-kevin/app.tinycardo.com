import { BrowserRouter } from "react-router-dom"
import { Route, Routes as RouteList } from "react-router-dom"
import { RouteChangeListener } from "@/modules/global/components/route_change_listener/route_change_listener"
import { DecksListPage } from "@/modules/decks/pages/decks_list_page"
import { DiscoverIndexPage } from "@/modules/discover/pages/discover_index_page"
import { ParamsPage } from "@/modules/params/pages/params_page"
import { SessionPage } from "@/modules/sessions/pages/session_page"

export function Routes() {
  return (
    <BrowserRouter>
      <RouteChangeListener />
      <RouteList>
        <Route path="/" element={<DecksListPage />} />
        <Route path="/params" element={<ParamsPage />} />
        <Route path="/sessions/:deck_id/:mode" element={<SessionPage />} />
        <Route path="/discover/" element={<DiscoverIndexPage />} />
      </RouteList>
    </BrowserRouter>
  )
}

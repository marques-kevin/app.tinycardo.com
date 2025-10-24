import { combineReducers } from "@reduxjs/toolkit"
import { global_reducers } from "@/modules/global/redux/global_reducers"
import { language_reducers } from "@/modules/language/redux/language_reducers"
import { params_reducers } from "@/modules/params/redux/params_reducers"
import { decks_reducers } from "@/modules/decks/redux/decks_reducers"
import { dialog_reducers } from "@/modules/dialog/redux/dialog_reducers"
import { sessions_reducers } from "@/modules/sessions/redux/sessions_reducers"
import { authentication_reducers } from "@/modules/authentication/redux/authentication_reducers"
import { discover_reducers } from "@/modules/discover/redux/discover_reducers"
import { decks_details_reducers } from "@/modules/deck_details/redux/deck_details_reducers"

export const reducers = combineReducers({
  sessions: sessions_reducers,
  global: global_reducers,
  language: language_reducers,
  decks: decks_reducers,
  decks_details: decks_details_reducers,
  params: params_reducers,
  dialog: dialog_reducers,
  authentication: authentication_reducers,
  discover: discover_reducers,
})

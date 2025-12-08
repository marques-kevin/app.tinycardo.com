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
import { deck_update_reducers } from "@/modules/deck_update/redux/deck_update_reducers"
import { streak_reducers } from "@/modules/streak/redux/streak_reducers"
import { ai_assistant_reducers } from "@/modules/ai_assistant/redux/ai_assistant_reducers"

export const reducers = combineReducers({
  deck_update: deck_update_reducers,
  sessions: sessions_reducers,
  global: global_reducers,
  language: language_reducers,
  decks: decks_reducers,
  decks_details: decks_details_reducers,
  streak: streak_reducers,
  params: params_reducers,
  dialog: dialog_reducers,
  authentication: authentication_reducers,
  discover: discover_reducers,
  ai_assistant: ai_assistant_reducers,
})

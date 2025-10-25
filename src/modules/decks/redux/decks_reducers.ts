import { createReducer } from "@reduxjs/toolkit"
import * as actions from "@/modules/decks/redux/decks_actions"
import type { DeckEntity } from "@/modules/decks/entities/deck_entity"
import type { CardEntity } from "@/modules/decks/entities/card_entity"
import { create_uuid_for_cards } from "@/modules/decks/utils/create_uuid_for_cards"
import { v4 } from "uuid"

const create_card = (): CardEntity => {
  return {
    id: v4() as CardEntity["id"],
    front: "",
    back: "",
    deck_id: "local",
  }
}

export type DecksState = {
  decks: DeckEntity[]
  stats: Record<
    string,
    {
      deck_id: string
      number_of_cards: number
      number_of_cards_ready_to_be_reviewed: number
      number_of_cards_not_ready_to_be_reviewed: number
    }
  >
  cards: Record<string, CardEntity[]>
  fetching: {
    fetching_cards: boolean
  }
  deck_actions_dialog: {
    open: boolean
    deck: {
      id: string
      name: string
      front_language: string
      back_language: string
      number_of_cards: number
      number_of_cards_ready_to_be_reviewed: number
      number_of_cards_not_ready_to_be_reviewed: number
    } | null
  }
  update: {
    deck_id: string | null
    csv_import_dialog: {
      open: boolean
      headers: string[]
      rows: string[][]
      selected_front: number
      selected_back: number
    }
    cards: CardEntity["id"][]
    cards_map: Record<string, CardEntity>
    title: string
    description: string
    visibility: "public" | "private" | "unlisted"
    front_language: string
    selected_cards: CardEntity["id"][]
    back_language: string
    is_loading: boolean
    is_updating: boolean
  }
}

const initialState: DecksState = {
  decks: [],
  stats: {},
  cards: {},
  fetching: {
    fetching_cards: false,
  },
  deck_actions_dialog: {
    open: false,
    deck: null,
  },

  update: {
    deck_id: null,
    csv_import_dialog: {
      open: false,
      headers: [],
      rows: [],
      selected_front: 0,
      selected_back: 1,
    },
    is_updating: false,
    selected_cards: [],
    cards: [],
    cards_map: {},
    title: "",
    description: "",
    visibility: "public",
    front_language: "en",
    back_language: "fr",
    is_loading: false,
  },
}

export const decks_reducers = createReducer(initialState, (builder) => {
  builder.addCase(actions._store_decks, (state, action) => {
    state.decks = action.payload
  })
  builder.addCase(actions._store_decks_stats, (state, action) => {
    state.stats = action.payload
  })

  builder.addCase(actions._open_csv_import_dialog, (state, action) => {
    state.update.csv_import_dialog = {
      open: true,
      headers: action.payload.headers,
      rows: action.payload.rows,
      selected_front: action.payload.selected_front,
      selected_back: action.payload.selected_back,
    }
  })

  builder.addCase(actions._update_csv_import_dialog, (state, action) => {
    if (!state.update.csv_import_dialog) return
    state.update.csv_import_dialog = {
      ...state.update.csv_import_dialog,
      ...action.payload,
    }
  })
  builder.addCase(actions._close_csv_import_dialog, (state) => {
    state.update.csv_import_dialog = {
      open: false,
      headers: [],
      rows: [],
      selected_front: 0,
      selected_back: 1,
    }
  })

  builder.addCase(actions.fetch_cards.pending, (state) => {
    state.fetching.fetching_cards = true
  })
  builder.addCase(actions.fetch_cards.fulfilled, (state, action) => {
    state.fetching.fetching_cards = false
    const deck_id = action.meta.arg.deck_id
    state.cards[deck_id] = action.payload
  })
  builder.addCase(actions.fetch_cards.rejected, (state) => {
    state.fetching.fetching_cards = false
  })

  builder.addCase(
    actions.apply_csv_import_mapping.fulfilled,
    (state, action) => {
      state.update.cards = action.payload.map((c) =>
        create_uuid_for_cards({ front: c.front, back: c.back }),
      )
      state.update.cards_map = action.payload.reduce(
        (acc, c) => {
          acc[create_uuid_for_cards({ front: c.front, back: c.back })] = {
            id: create_uuid_for_cards({ front: c.front, back: c.back }),
            front: c.front,
            back: c.back,
            deck_id: "local",
          }
          return acc
        },
        {} as Record<string, CardEntity>,
      )
    },
  )

  builder.addCase(actions.import_cards_from_csv.fulfilled, (state, action) => {
    if (action.payload && action.payload.length > 0) {
      state.update.cards = action.payload.map((c) =>
        create_uuid_for_cards({ front: c.front, back: c.back }),
      )
      state.update.cards_map = action.payload.reduce(
        (acc, c) => {
          acc[create_uuid_for_cards({ front: c.front, back: c.back })] = {
            id: create_uuid_for_cards({ front: c.front, back: c.back }),
            front: c.front,
            back: c.back,
            deck_id: "local",
          }
          return acc
        },
        {} as Record<string, CardEntity>,
      )
    }
  })

  builder.addCase(actions._create_deck_set_cards, (state, action) => {
    state.update.cards = action.payload.map((c) => c.id)
    state.update.cards_map = action.payload.reduce(
      (acc, c) => {
        acc[c.id] = c
        return acc
      },
      {} as Record<string, CardEntity>,
    )
  })

  builder.addCase(actions.reset_create_deck, (state) => {
    state.update = { ...initialState.update }
  })

  /**
   *
   *
   *
   *
   * UPDATE DECK ACTIONS
   *
   *
   *
   *
   */

  builder.addCase(actions.create_deck_update_card, (state, action) => {
    state.update.cards_map[action.payload.id] = {
      ...state.update.cards_map[action.payload.id],
      [action.payload.field]: action.payload.value,
    }

    const last_card_id = state.update.cards[state.update.cards.length - 1]
    const last_card = state.update.cards_map[last_card_id]

    if (last_card.front !== "" || last_card.back !== "") {
      const card = create_card()
      state.update.cards.push(card.id)
      state.update.cards_map[card.id] = card
    }
  })

  builder.addCase(actions.create_deck_remove_card, (state, action) => {
    state.update.cards = state.update.cards.filter(
      (c) => c !== action.payload.id,
    )
    delete state.update.cards_map[action.payload.id]
  })

  builder.addCase(actions.update_deck_toggle_select_card, (state, action) => {
    state.update.selected_cards = state.update.selected_cards.includes(
      action.payload.card_id,
    )
      ? state.update.selected_cards.filter((c) => c !== action.payload.card_id)
      : [...state.update.selected_cards, action.payload.card_id]
  })

  builder.addCase(actions.update_deck_delete_selected_cards, (state) => {
    state.update.cards = state.update.cards.filter(
      (c) => !state.update.selected_cards.includes(c),
    )
    state.update.cards_map = Object.fromEntries(
      Object.entries(state.update.cards_map).filter(
        ([key]) => !state.update.selected_cards.includes(key),
      ),
    )
    state.update.selected_cards = []

    const last_card_id = state.update.cards[state.update.cards.length - 1]
    const last_card = state.update.cards_map[last_card_id]

    if (
      state.update.cards.length === 0 ||
      last_card.front !== "" ||
      last_card.back !== ""
    ) {
      const card = create_card()
      state.update.cards.push(card.id)
      state.update.cards_map[card.id] = card
    }
  })

  builder.addCase(actions.update_deck_toggle_select_all_cards, (state) => {
    if (state.update.selected_cards.length === state.update.cards.length) {
      state.update.selected_cards = []
    } else {
      state.update.selected_cards = state.update.cards.map((card_id) => card_id)
    }
  })

  builder.addCase(actions.update_deck_set_title, (state, action) => {
    state.update.title = action.payload.title
  })

  builder.addCase(actions.update_deck_set_description, (state, action) => {
    state.update.description = action.payload.description
  })

  builder.addCase(actions.update_deck_set_visibility, (state, action) => {
    state.update.visibility = action.payload.visibility
  })

  builder.addCase(
    actions.create_deck_update_front_language,
    (state, action) => {
      state.update.front_language = action.payload.language
    },
  )

  builder.addCase(actions.create_deck_update_back_language, (state, action) => {
    state.update.back_language = action.payload.language
  })

  builder.addCase(actions.update_deck.pending, (state) => {
    state.update.is_updating = true
  })
  builder.addCase(actions.update_deck.fulfilled, (state) => {
    state.update.is_updating = false
  })
  builder.addCase(actions.update_deck.rejected, (state) => {
    state.update.is_updating = false
  })

  builder.addCase(actions.load_deck_into_create_form.pending, (state) => {
    state.update.is_loading = true
  })

  builder.addCase(actions.load_deck_into_create_form.rejected, (state) => {
    state.update.is_loading = false
  })

  builder.addCase(
    actions.load_deck_into_create_form.fulfilled,
    (state, action) => {
      state.update.is_loading = false

      if (!action.payload) return

      state.update.deck_id = action.payload.deck.id
      state.update.title = action.payload.deck.name
      state.update.visibility = action.payload.deck.visibility
      state.update.front_language = action.payload.deck.front_language
      state.update.back_language = action.payload.deck.back_language
      state.update.cards = action.payload.cards.map((c) => c.id)
      state.update.cards_map = action.payload.cards.reduce(
        (acc, c) => {
          acc[c.id] = c
          return acc
        },
        {} as Record<string, CardEntity>,
      )
    },
  )
})

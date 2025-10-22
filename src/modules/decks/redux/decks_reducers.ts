import { createReducer } from "@reduxjs/toolkit"
import * as actions from "@/modules/decks/redux/decks_actions"
import type { DeckEntity } from "@/modules/decks/entities/deck_entity"
import type { CardEntity } from "@/modules/decks/entities/card_entity"
import { create_uuid_for_cards } from "@/modules/decks/utils/create_uuid_for_cards"
import { v4 } from "uuid"

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
  create_deck: {
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
    front_language: string
    back_language: string
    is_loading: boolean
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
  create_deck: {
    csv_import_dialog: {
      open: false,
      headers: [],
      rows: [],
      selected_front: 0,
      selected_back: 1,
    },
    cards: [],
    cards_map: {},
    title: "",
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
  // builder.addCase(_set_fetching, (state, action) => {
  //   // state.fetching[action.payload.key] = action.payload.value
  // })
  // builder.addCase(_set_decks, (state, action) => {
  //   state.decks = action.payload
  // })
  // builder.addCase(_set_filter_fields, (state, action) => {
  //   state.filter = { ...state.filter, ...action.payload }
  // })
  // builder.addCase(clear_filter, (state) => {
  //   state.filter = {
  //     name: null,
  //     origin_language: null,
  //     learning_language: null,
  //   }
  // })
  // builder.addCase(_set_pagination, (state, action) => {
  //   if (typeof action.payload.current_page === "number") {
  //     state.pagination.current_page = action.payload.current_page
  //   }
  //   if (typeof action.payload.total_pages === "number") {
  //     state.pagination.total_pages = action.payload.total_pages
  //   }
  //   if (typeof action.payload.limit === "number") {
  //     state.pagination.limit = action.payload.limit
  //   }
  // })
  // builder.addCase(_set_cards, (state, action) => {
  //   state.cards = action.payload
  // })
  // // Draft handlers
  builder.addCase(actions._draft_set_title, (state, action) => {
    state.create_deck.title = action.payload.title
  })
  // builder.addCase(_draft_set_description, (state, action) => {
  //   state.draft.description = action.payload.description
  // })
  // builder.addCase(_draft_add_card, (state, action) => {
  //   state.draft.cards.push(action.payload)
  // })
  // builder.addCase(_draft_update_card, (state, action) => {
  //   const idx = state.draft.cards.findIndex((c) => c.id === action.payload.id)
  //   if (idx >= 0) {
  //     state.draft.cards[idx][action.payload.field] = action.payload.value
  //   }
  // })
  // builder.addCase(actions._draft_remove_card, (state, action) => {
  //   state.draft.cards = state.draft.cards.filter(
  //     (c) => c.id !== action.payload.id,
  //   )
  // })
  // builder.addCase(actions._draft_add_cards_bulk, (state, action) => {
  //   state.draft.cards = state.draft.cards.concat(action.payload)
  // })
  // builder.addCase(actions._draft_clear, (state) => {
  //   state.draft = { title: "", description: "", cards: [] }
  // })
  builder.addCase(actions._open_csv_import_dialog, (state, action) => {
    state.create_deck.csv_import_dialog = {
      open: true,
      headers: action.payload.headers,
      rows: action.payload.rows,
      selected_front: action.payload.selected_front,
      selected_back: action.payload.selected_back,
    }
  })

  builder.addCase(actions._update_csv_import_dialog, (state, action) => {
    if (!state.create_deck.csv_import_dialog) return
    state.create_deck.csv_import_dialog = {
      ...state.create_deck.csv_import_dialog,
      ...action.payload,
    }
  })
  builder.addCase(actions._close_csv_import_dialog, (state) => {
    state.create_deck.csv_import_dialog = {
      open: false,
      headers: [],
      rows: [],
      selected_front: 0,
      selected_back: 1,
    }
  })

  builder.addCase(actions._open_deck_actions_dialog, (state, action) => {
    state.deck_actions_dialog = {
      open: true,
      deck: action.payload.deck,
    }
  })

  builder.addCase(actions._close_deck_actions_dialog, (state) => {
    state.deck_actions_dialog = {
      open: false,
      deck: null,
    }
  })

  // Fetch cards
  builder.addCase(actions.fetch_cards.pending, (state) => {
    state.fetching.fetching_cards = true
  })
  builder.addCase(actions.fetch_cards.fulfilled, (state, action) => {
    state.fetching.fetching_cards = false
    // Extract deck_id from the action meta
    const deck_id = action.meta.arg.deck_id
    state.cards[deck_id] = action.payload
  })
  builder.addCase(actions.fetch_cards.rejected, (state) => {
    state.fetching.fetching_cards = false
  })

  builder.addCase(
    actions.apply_csv_import_mapping.fulfilled,
    (state, action) => {
      state.create_deck.cards = action.payload.map((c) =>
        create_uuid_for_cards({ front: c.front, back: c.back }),
      )
      state.create_deck.cards_map = action.payload.reduce(
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
      state.create_deck.cards = action.payload.map((c) =>
        create_uuid_for_cards({ front: c.front, back: c.back }),
      )
      state.create_deck.cards_map = action.payload.reduce(
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

  builder.addCase(actions.create_deck_add_new_card, (state) => {
    const id = v4() as CardEntity["id"]
    state.create_deck.cards.push(id)
    state.create_deck.cards_map[id] = {
      id,
      front: "",
      back: "",
      deck_id: "local",
    }
  })

  builder.addCase(actions._create_deck_set_cards, (state, action) => {
    state.create_deck.cards = action.payload.map((c) => c.id)
    state.create_deck.cards_map = action.payload.reduce(
      (acc, c) => {
        acc[c.id] = c
        return acc
      },
      {} as Record<string, CardEntity>,
    )
  })

  builder.addCase(actions.reset_create_deck, (state) => {
    state.create_deck = {
      csv_import_dialog: {
        open: false,
        headers: [],
        rows: [],
        selected_front: 0,
        selected_back: 1,
      },
      cards: [],
      cards_map: {},
      title: "",
      front_language: "en",
      back_language: "fr",
      is_loading: false,
    }
  })

  // Loading for update page prefetch
  builder.addCase(actions.load_deck_into_create_form.pending, (state) => {
    state.create_deck.is_loading = true
  })
  builder.addCase(actions.load_deck_into_create_form.fulfilled, (state) => {
    state.create_deck.is_loading = false
  })
  builder.addCase(actions.load_deck_into_create_form.rejected, (state) => {
    state.create_deck.is_loading = false
  })

  builder.addCase(actions.create_deck_remove_card, (state, action) => {
    state.create_deck.cards = state.create_deck.cards.filter(
      (c) => c !== action.payload.id,
    )
    delete state.create_deck.cards_map[action.payload.id]
  })

  builder.addCase(actions.create_deck_update_card, (state, action) => {
    state.create_deck.cards_map[action.payload.id] = {
      ...state.create_deck.cards_map[action.payload.id],
      [action.payload.field]: action.payload.value,
    }
  })

  builder.addCase(
    actions.create_deck_update_front_language,
    (state, action) => {
      state.create_deck.front_language = action.payload.language
    },
  )

  builder.addCase(actions.create_deck_update_back_language, (state, action) => {
    state.create_deck.back_language = action.payload.language
  })
})

import { createReducer } from "@reduxjs/toolkit"
import * as actions from "@/modules/deck_update/redux/deck_update_actions"
import type { CardEntity } from "@/modules/decks/entities/card_entity"
import { create_uuid_for_cards } from "@/modules/decks/utils/create_uuid_for_cards"
import { v4 } from "uuid"
import type { LessonEntity } from "@/modules/decks/entities/lesson_entity"

const create_card = (): CardEntity => {
  return {
    id: v4() as CardEntity["id"],
    front: "",
    back: "",
    deck_id: "local",
  }
}

export type DeckUpdateState = {
  deck_id: string | null
  csv_import_dialog: {
    open: boolean
    headers: string[]
    rows: string[][]
    selected_front: number
    selected_back: number
  }
  cards: CardEntity["id"][]
  cards_filtered_by_lesson_tab: CardEntity["id"][]
  cards_map: Record<string, CardEntity>
  title: string
  description: string
  visibility: "public" | "private" | "unlisted"
  front_language: string
  selected_cards: CardEntity["id"][]
  back_language: string
  is_loading: boolean
  is_updating: boolean
  rename_lesson_modal: string | null
  add_cards_to_lesson_modal: boolean
  add_cards_to_lesson_selected_lesson_id: string | null
  lessons: LessonEntity[]
  active_lesson_id: string | null
}

const compute_filtered_cards = (state: DeckUpdateState) => {
  if (state.active_lesson_id === null) {
    return state.cards
  }

  const active_lesson = state.lessons.find(
    (l) => l.id === state.active_lesson_id,
  )

  if (!active_lesson) {
    return state.cards
  }

  return state.cards.filter((card_id) => active_lesson.cards.includes(card_id))
}

export const select_filtered_cards = compute_filtered_cards

const initialState: DeckUpdateState = {
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
  cards_filtered_by_lesson_tab: [],
  cards_map: {},
  title: "",
  description: "",
  visibility: "public",
  front_language: "en",
  back_language: "fr",
  is_loading: false,
  rename_lesson_modal: null,
  add_cards_to_lesson_modal: false,
  add_cards_to_lesson_selected_lesson_id: null,
  lessons: [],
  active_lesson_id: null,
}

export const deck_update_reducers = createReducer(initialState, (builder) => {
  builder.addCase(actions._open_csv_import_dialog, (state, action) => {
    state.csv_import_dialog = {
      open: true,
      headers: action.payload.headers,
      rows: action.payload.rows,
      selected_front: action.payload.selected_front,
      selected_back: action.payload.selected_back,
    }
  })

  builder.addCase(actions._update_csv_import_dialog, (state, action) => {
    if (!state.csv_import_dialog) return
    state.csv_import_dialog = {
      ...state.csv_import_dialog,
      ...action.payload,
    }
  })

  builder.addCase(actions._close_csv_import_dialog, (state) => {
    state.csv_import_dialog = {
      open: false,
      headers: [],
      rows: [],
      selected_front: 0,
      selected_back: 1,
    }
  })

  builder.addCase(
    actions.apply_csv_import_mapping.fulfilled,
    (state, action) => {
      state.cards = action.payload.map((c) =>
        create_uuid_for_cards({ front: c.front, back: c.back }),
      )
      state.cards_map = action.payload.reduce(
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
      state.cards = action.payload.map((c) =>
        create_uuid_for_cards({ front: c.front, back: c.back }),
      )
      state.cards_map = action.payload.reduce(
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

  builder.addCase(actions._draft_add_cards_bulk, (state, action) => {
    state.cards = action.payload.map((c) => c.id)
    state.cards_map = action.payload.reduce(
      (acc, c) => {
        acc[c.id] = c
        return acc
      },
      {} as Record<string, CardEntity>,
    )
  })

  builder.addCase(actions._draft_clear, (state) => {
    state.cards = []
    state.cards_map = {}
    state.selected_cards = []
    state.title = ""
    state.description = ""
    state.visibility = "public"
    state.front_language = "en"
    state.back_language = "fr"
  })

  builder.addCase(actions._draft_update_card, (state, action) => {
    state.cards_map[action.payload.id] = {
      ...state.cards_map[action.payload.id],
      [action.payload.field]: action.payload.value,
    }

    const last_card_id = state.cards[state.cards.length - 1]
    const last_card = state.cards_map[last_card_id]

    if (last_card.front !== "" || last_card.back !== "") {
      const card = create_card()
      state.cards.push(card.id)
      state.cards_map[card.id] = card
    }
  })

  builder.addCase(actions._draft_remove_card, (state, action) => {
    state.cards = state.cards.filter((c) => c !== action.payload.id)
    delete state.cards_map[action.payload.id]
  })

  builder.addCase(actions.update_deck_toggle_select_card, (state, action) => {
    state.selected_cards = state.selected_cards.includes(action.payload.card_id)
      ? state.selected_cards.filter((c) => c !== action.payload.card_id)
      : [...state.selected_cards, action.payload.card_id]
  })

  builder.addCase(actions.update_deck_delete_selected_cards, (state) => {
    state.cards = state.cards.filter((c) => !state.selected_cards.includes(c))
    state.cards_map = Object.fromEntries(
      Object.entries(state.cards_map).filter(
        ([key]) => !state.selected_cards.includes(key),
      ),
    )
    state.selected_cards = []

    const last_card_id = state.cards[state.cards.length - 1]
    const last_card = state.cards_map[last_card_id]

    if (
      state.cards.length === 0 ||
      last_card.front !== "" ||
      last_card.back !== ""
    ) {
      const card = create_card()
      state.cards.push(card.id)
      state.cards_map[card.id] = card
    }
  })

  builder.addCase(actions.update_deck_toggle_select_all_cards, (state) => {
    if (state.selected_cards.length === state.cards.length) {
      state.selected_cards = []
    } else {
      state.selected_cards = state.cards.map((card_id) => card_id)
    }
  })

  builder.addCase(actions.update_deck_set_title, (state, action) => {
    state.title = action.payload.title
  })

  builder.addCase(actions.update_deck_set_description, (state, action) => {
    state.description = action.payload.description
  })

  builder.addCase(actions.update_deck_set_visibility, (state, action) => {
    state.visibility = action.payload.visibility
  })

  builder.addCase(
    actions.create_deck_update_front_language,
    (state, action) => {
      state.front_language = action.payload.language
    },
  )

  builder.addCase(actions.create_deck_update_back_language, (state, action) => {
    state.back_language = action.payload.language
  })

  builder.addCase(actions.update_deck.pending, (state) => {
    state.is_updating = true
  })

  builder.addCase(actions.update_deck.fulfilled, (state) => {
    state.is_updating = false
  })

  builder.addCase(actions.update_deck.rejected, (state) => {
    state.is_updating = false
  })

  builder.addCase(actions.load_deck_into_create_form.pending, (state) => {
    state.is_loading = true
  })

  builder.addCase(actions.load_deck_into_create_form.rejected, (state) => {
    state.is_loading = false
  })

  builder.addCase(
    actions.load_deck_into_create_form.fulfilled,
    (state, action) => {
      state.is_loading = false

      if (!action.payload) return

      const cards =
        action.payload.cards.length > 0 ? action.payload.cards : [create_card()]

      state.deck_id = action.payload.deck.id
      state.title = action.payload.deck.name
      state.visibility = action.payload.deck.visibility
      state.description = action.payload.deck.description || ""
      state.front_language = action.payload.deck.front_language
      state.back_language = action.payload.deck.back_language
      state.cards = cards.map((c) => c.id)
      state.cards_map = cards.reduce(
        (acc, c) => {
          acc[c.id] = c
          return acc
        },
        {} as Record<string, CardEntity>,
      )
      state.lessons = action.payload.lessons
    },
  )

  builder.addCase(actions.open_rename_lesson_modal, (state, action) => {
    state.rename_lesson_modal = action.payload.lesson_id
  })

  builder.addCase(actions.close_rename_lesson_modal, (state) => {
    state.rename_lesson_modal = null
  })

  builder.addCase(actions.rename_lesson.fulfilled, (state, action) => {
    state.rename_lesson_modal = null
    const index = state.lessons.findIndex((l) => l.id === action.payload.id)
    if (index !== -1) {
      state.lessons[index] = action.payload
    }
  })

  builder.addCase(actions.create_lesson.fulfilled, (state, action) => {
    state.lessons.push(action.payload)
  })

  builder.addCase(actions.delete_lesson.fulfilled, (state, action) => {
    state.lessons = state.lessons.filter(
      (l) => l.id !== action.payload.lesson_id,
    )
    if (state.active_lesson_id === action.payload.lesson_id) {
      state.active_lesson_id = null
    }
  })

  builder.addCase(actions.set_active_lesson, (state, action) => {
    state.active_lesson_id = action.payload.lesson_id
  })

  builder.addCase(actions.open_add_cards_to_lesson_modal, (state) => {
    state.add_cards_to_lesson_modal = true
    state.add_cards_to_lesson_selected_lesson_id = null
  })

  builder.addCase(actions.close_add_cards_to_lesson_modal, (state) => {
    state.add_cards_to_lesson_modal = false
    state.add_cards_to_lesson_selected_lesson_id = null
  })

  builder.addCase(
    actions.add_selected_cards_to_lesson.fulfilled,
    (state, action) => {
      const lesson = state.lessons.find(
        (l) => l.id === action.payload.lesson_id,
      )
      if (!lesson) return

      // Add selected cards to lesson, avoiding duplicates
      const new_card_ids = [
        ...new Set([...lesson.cards, ...state.selected_cards]),
      ]
      lesson.cards = new_card_ids
      state.selected_cards = []
      state.add_cards_to_lesson_modal = false
    },
  )

  // Recompute filtered cards after any action that might affect them
  builder.addMatcher(
    () => true,
    (state) => {
      state.cards_filtered_by_lesson_tab = compute_filtered_cards(state)
    },
  )
})

import { createReducer } from "@reduxjs/toolkit"
import * as actions from "@/modules/deck_update/redux/deck_update_actions"
import type { CardEntity } from "@/modules/decks/entities/card_entity"
import { create_uuid_for_cards } from "@/modules/decks/utils/create_uuid_for_cards"
import { v4 } from "uuid"
import type { LessonEntity } from "@/modules/decks/entities/lesson_entity"
import type { DeckEntity } from "@/modules/decks/entities/deck_entity"
import { deck_update_filter_cards_by_lesson } from "../utils/deck_update_filter_cards_by_lesson"
import { last } from "lodash"

const create_card = (): CardEntity => {
  return {
    id: v4() as CardEntity["id"],
    front: "",
    back: "",
    deck_id: "local",
    front_audio_url: "",
    back_audio_url: "",
  }
}

export type DeckUpdateState = {
  deck: DeckEntity | null
  csv_import_dialog: {
    is_open: boolean
    headers: string[]
    rows: string[][]
    selected_front: number
    selected_back: number
  }
  ai: {
    updating_description: boolean
    cards_that_are_being_generated_by_ai: CardEntity["id"][]
  }
  cards: CardEntity["id"][]
  cards_filtered_by_lesson_tab: CardEntity["id"][]
  cards_map: Record<string, CardEntity>
  selected_cards: CardEntity["id"][]
  is_loading: boolean
  is_updating: boolean
  rename_lesson_modal: string | null
  add_cards_to_lesson_modal: boolean
  add_cards_to_lesson_selected_lesson_id: string | null
  reorder_lessons_modal: boolean
  is_updating_description_with_ai: boolean
  lessons: LessonEntity[]
  active_lesson_id: string | null
}

const should_add_empty_card = (cards: CardEntity[]): boolean => {
  if (cards.length === 0) {
    return true
  }

  return cards.every((c) => c?.front !== "" && c?.back !== "")
}

const add_empty_card_if_needed = (cards: CardEntity[]): CardEntity[] => {
  if (cards.length === 0) {
    return [create_card()]
  }

  const last_card = last(cards)!

  if (last_card.front !== "" || last_card.back !== "") {
    return [...cards, create_card()]
  }

  return cards
}

const initialState: DeckUpdateState = {
  deck: null,
  csv_import_dialog: {
    is_open: false,
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
  is_loading: false,
  rename_lesson_modal: null,
  add_cards_to_lesson_modal: false,
  add_cards_to_lesson_selected_lesson_id: null,
  reorder_lessons_modal: false,
  is_updating_description_with_ai: false,
  lessons: [],
  active_lesson_id: null,
  ai: {
    updating_description: false,
    cards_that_are_being_generated_by_ai: [],
  },
}

export const deck_update_reducers = createReducer(initialState, (builder) => {
  builder.addCase(actions._open_csv_import_dialog, (state, action) => {
    state.csv_import_dialog = {
      is_open: true,
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
      is_open: false,
      headers: [],
      rows: [],
      selected_front: 0,
      selected_back: 1,
    }
  })

  builder.addCase(actions.delete_card, (state, action) => {
    state.cards = state.cards.filter((c) => c !== action.payload.id)
    state.cards_map = Object.fromEntries(
      Object.entries(state.cards_map).filter(
        ([key]) => key !== action.payload.id,
      ),
    )

    state.lessons = state.lessons.map((lesson) => ({
      ...lesson,
      cards: lesson.cards.filter((c) => c !== action.payload.id),
    }))

    state.cards_filtered_by_lesson_tab = deck_update_filter_cards_by_lesson({
      cards: state.cards,
      lessons: state.lessons,
      lesson_id: state.active_lesson_id,
    })

    if (state.cards_filtered_by_lesson_tab.length === 0) {
      const new_card = create_card()
      state.cards = [...state.cards, new_card.id]
      state.cards_map = {
        ...state.cards_map,
        [new_card.id]: new_card,
      }
      state.lessons = state.lessons.map((lesson) => ({
        ...lesson,
        cards: [...lesson.cards, new_card.id],
      }))

      state.cards_filtered_by_lesson_tab = deck_update_filter_cards_by_lesson({
        cards: state.cards,
        lessons: state.lessons,
        lesson_id: state.active_lesson_id,
      })
    }
  })

  builder.addCase(actions._add_cards_from_import, (state, action) => {
    const cards = action.payload.cards.map((c) => ({
      id: create_uuid_for_cards({ front: c.front, back: c.back }),
      front: c.front,
      back: c.back,
      deck_id: state.deck!.id,
      front_audio_url: "",
      back_audio_url: "",
      lesson_id: c.lesson_id,
    }))

    cards.forEach((card) => {
      state.cards_map[card.id] = card

      if (card.lesson_id) {
        const lesson = state.lessons.find((l) => l.id === card.lesson_id)

        if (lesson) {
          lesson.cards = [...lesson.cards, card.id]
        }
      }
    })

    state.cards = [...state.cards, ...cards.map((card) => card.id)]

    // if (state.active_lesson_id) {
    //   state.lessons = state.lessons.map((lesson) => {
    //     if (lesson.id === state.active_lesson_id) {
    //       return {
    //         ...lesson,
    //         cards: [...lesson.cards, ...cards.map((c) => c.id)],
    //       }
    //     }

    //     return lesson
    //   })
    // }

    state.cards_filtered_by_lesson_tab = deck_update_filter_cards_by_lesson({
      cards: state.cards,
      lessons: state.lessons,
      lesson_id: state.active_lesson_id,
    })
  })

  builder.addCase(actions.reset_create_deck, (state) => {
    return {
      ...initialState,
    }
  })

  builder.addCase(actions.update_card, (state, action) => {
    state.cards_map[action.payload.id] = {
      ...state.cards_map[action.payload.id],
      [action.payload.field]: action.payload.value,
    }

    const last_card_id = last(state.cards_filtered_by_lesson_tab)!
    const last_card = state.cards_map[last_card_id]

    if (!last_card) return

    if (last_card.front !== "" || last_card.back !== "") {
      const card = create_card()
      state.cards.push(card.id)
      state.cards_map[card.id] = card

      state.lessons = state.lessons.map((lesson) => {
        if (lesson.id === state.active_lesson_id) {
          return {
            ...lesson,
            cards: [...lesson.cards, card.id],
          }
        }

        return lesson
      })

      state.cards_filtered_by_lesson_tab = deck_update_filter_cards_by_lesson({
        cards: state.cards,
        lessons: state.lessons,
        lesson_id: state.active_lesson_id,
      })
    }
  })

  builder.addCase(actions.toggle_select_card, (state, action) => {
    state.selected_cards = state.selected_cards.includes(action.payload.card_id)
      ? state.selected_cards.filter((c) => c !== action.payload.card_id)
      : [...state.selected_cards, action.payload.card_id]
  })

  builder.addCase(actions.delete_selected_cards.fulfilled, (state, action) => {
    if (state.active_lesson_id) {
      const lesson = state.lessons.find((l) => l.id === state.active_lesson_id)
      if (!lesson) return

      lesson.cards = lesson.cards.filter(
        (c) => !state.selected_cards.includes(c),
      )
      state.selected_cards = []
      state.add_cards_to_lesson_modal = false
    } else {
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
    }

    state.cards_filtered_by_lesson_tab = deck_update_filter_cards_by_lesson({
      cards: state.cards,
      lessons: state.lessons,
      lesson_id: state.active_lesson_id,
    })
  })

  builder.addCase(actions.toggle_select_all_cards, (state) => {
    if (
      state.selected_cards.length === state.cards_filtered_by_lesson_tab.length
    ) {
      state.selected_cards = []
    } else {
      state.selected_cards = state.cards_filtered_by_lesson_tab.map(
        (card_id) => card_id,
      )
    }
  })

  builder.addCase(actions.update_field, (state, action) => {
    state.deck = {
      ...state.deck,
      ...action.payload,
    } as DeckEntity
  })

  builder.addCase(actions.save.pending, (state) => {
    state.is_updating = true
  })

  builder.addCase(actions.save.fulfilled, (state) => {
    state.is_updating = false
  })

  builder.addCase(actions.save.rejected, (state) => {
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

      const cards = add_empty_card_if_needed(action.payload.cards)

      state.deck = action.payload.deck
      state.cards = cards.map((c) => c.id)
      state.cards_map = cards.reduce(
        (acc, c) => {
          acc[c.id] = c
          return acc
        },
        {} as Record<string, CardEntity>,
      )
      state.lessons = [...action.payload.lessons].sort(
        (a, b) => a.position - b.position,
      )
      state.active_lesson_id = null
      state.cards_filtered_by_lesson_tab = deck_update_filter_cards_by_lesson({
        cards: state.cards,
        lessons: state.lessons,
        lesson_id: state.active_lesson_id,
      })
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

    state.lessons = state.lessons.map((lesson) => {
      if (lesson.id === action.payload.id) {
        return {
          ...lesson,
          name: action.payload.name,
          updated_at: action.payload.updated_at,
        }
      }

      return lesson
    })
  })

  builder.addCase(actions.create_lesson.fulfilled, (state, action) => {
    state.lessons.push(action.payload)
    state.lessons.sort((a, b) => a.position - b.position)
  })

  builder.addCase(actions.delete_lesson.fulfilled, (state, action) => {
    state.lessons = state.lessons.filter(
      (l) => l.id !== action.payload.lesson_id,
    )
    if (state.active_lesson_id === action.payload.lesson_id) {
      state.active_lesson_id = null
      state.cards_filtered_by_lesson_tab = deck_update_filter_cards_by_lesson({
        cards: state.cards,
        lessons: state.lessons,
        lesson_id: state.active_lesson_id,
      })
    }
  })

  builder.addCase(actions.set_active_lesson, (state, action) => {
    const lesson_id = action.payload.lesson_id

    if (lesson_id === state.active_lesson_id) return

    state.active_lesson_id = lesson_id

    if (lesson_id) {
      const lesson = state.lessons.find((lesson) => lesson.id === lesson_id)

      if (!lesson) return

      const new_card_empty = create_card()
      const cards = should_add_empty_card(
        lesson.cards.map((c) => state.cards_map[c]),
      )
        ? [...state.cards, new_card_empty.id]
        : state.cards

      state.cards = cards
      state.cards_map[new_card_empty.id] = new_card_empty
      lesson.cards.push(new_card_empty.id)
    }

    state.cards_filtered_by_lesson_tab = deck_update_filter_cards_by_lesson({
      cards: state.cards,
      lessons: state.lessons,
      lesson_id: state.active_lesson_id,
    })

    state.selected_cards = []
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
      state.cards_filtered_by_lesson_tab = deck_update_filter_cards_by_lesson({
        cards: state.cards,
        lessons: state.lessons,
        lesson_id: state.active_lesson_id,
      })
    },
  )

  builder.addCase(actions.open_reorder_lessons_modal, (state) => {
    state.reorder_lessons_modal = true
  })

  builder.addCase(actions.close_reorder_lessons_modal, (state) => {
    state.reorder_lessons_modal = false
  })

  builder.addCase(actions.update_description_with_ai.pending, (state) => {
    state.is_updating_description_with_ai = true
  })

  builder.addCase(
    actions.update_description_with_ai.fulfilled,
    (state, action) => {
      state.is_updating_description_with_ai = false
      if (state.deck) {
        state.deck.description = action.payload.description
      }
    },
  )

  builder.addCase(actions.update_description_with_ai.rejected, (state) => {
    state.is_updating_description_with_ai = false
  })

  builder.addCase(actions.reorder_lessons.fulfilled, (state, action) => {
    state.reorder_lessons_modal = false

    // Update lesson positions in state
    for (const reorder_item of action.meta.arg.reorder_data) {
      const lesson = state.lessons.find((l) => l.id === reorder_item.lesson_id)
      if (lesson) {
        lesson.position = reorder_item.position
        lesson.updated_at = new Date()
      }
    }

    // Sort lessons by position
    state.lessons.sort((a, b) => a.position - b.position)
  })

  builder.addCase(actions.translate_card_with_ai.pending, (state, action) => {
    state.ai.cards_that_are_being_generated_by_ai.push(action.meta.arg.card_id)
  })

  builder.addCase(actions.translate_card_with_ai.fulfilled, (state, action) => {
    state.ai.cards_that_are_being_generated_by_ai =
      state.ai.cards_that_are_being_generated_by_ai.filter(
        (c) => c !== action.payload.card_id,
      )
  })

  builder.addCase(actions.translate_card_with_ai.rejected, (state, action) => {
    state.ai.cards_that_are_being_generated_by_ai =
      state.ai.cards_that_are_being_generated_by_ai.filter(
        (c) => c !== action.meta.arg.card_id,
      )
  })

  builder.addCase(actions.swap_languages, (state) => {
    state.deck = {
      ...state.deck,
      front_language: state.deck?.back_language,
      back_language: state.deck?.front_language,
    } as DeckEntity

    state.cards_map = Object.fromEntries(
      Object.entries(state.cards_map).map(([key, card]) => {
        return [
          key,
          {
            ...card,
            front: card.back,
            back: card.front,
          },
        ]
      }),
    )
  })
})

# View Mapping: Why We Map IDs Instead of Sending UUIDs Directly to AI

## Problem Statement

When integrating AI assistants with our application, we need to send context about cards and lessons. The natural approach would be to send the actual UUIDs (like `"550e8400-e29b-41d4-a716-446655440000"`) that our system uses internally. However, this creates several problems:

## Why UUIDs Are Problematic for AI

1. **Token Inefficiency**: UUIDs are 36 characters long. Sending hundreds of cards with UUIDs consumes significant tokens, increasing API costs and reducing the context window available for actual instructions.

2. **AI Confusion**: UUIDs are random, meaningless strings to the AI. When an AI needs to reference "the first card" or "the card about animals", it's much easier to work with simple IDs like `"0"`, `"1"`, `"2"` rather than remembering `"550e8400-e29b-41d4-a716-446655440000"`.

3. **Error-Prone**: When the AI returns actions with card/lesson IDs, there's a higher chance of typos or incorrect references when dealing with long, complex UUIDs.

4. **Context Clarity**: Simple sequential IDs make the context more readable for the AI. It can easily understand relationships like "card 0, 1, and 2 belong to lesson 0" rather than trying to match UUIDs.

## The Solution: View Mapping

We created a **view mapping system** that acts as a translation layer between AI-friendly IDs and our internal UUIDs.

### How It Works

1. **When Sending Context to AI** (`ai_assistant_actions.ts:195-215`):
   - We create a view mapping that assigns simple sequential IDs (`"0"`, `"1"`, `"2"`, etc.) to cards and lessons
   - The AI receives context with these simple IDs instead of UUIDs
   - Example: `{ id: "0", front: "Hello", back: "Bonjour" }` instead of `{ id: "550e8400-...", front: "Hello", back: "Bonjour" }`

2. **When Receiving Actions from AI** (`ai_assistant_actions.ts:19-150`):
   - The AI returns actions using the simple IDs (e.g., `card_ids: ["0", "1"]`)
   - We use the view mapping to translate these back to real UUIDs
   - Example: `view.cards["0"].id` → `"550e8400-e29b-41d4-a716-446655440000"`

3. **View Mapping Storage** (`ai_assistant_reducers.ts:13-16, 49-75`):
   - The view is stored in Redux state: `state.ai_assistant.view`
   - Contains two maps:
     - `view.lessons`: Maps simple IDs → `LessonEntity` objects
     - `view.cards`: Maps simple IDs → `CardEntity` objects (with `lesson_id` included)

## Implementation Details

### Creating the View Mapping

```typescript
// ai_assistant_reducers.ts:49-75
builder.addCase(actions.create_a_view_mapping.fulfilled, (state, action) => {
  // Map lessons: "0" → lesson1, "1" → lesson2, etc.
  state.view.lessons = action.payload.lessons.reduce(
    (acc, lesson, index) => {
      const id = index.toString() // "0", "1", "2"...
      acc[id] = lesson
      return acc
    },
    {} as Record<string, LessonEntity>,
  )

  // Map cards: "0" → card1, "1" → card2, etc.
  // Also includes lesson_id for easy reference
  state.view.cards = action.payload.cards.reduce(
    (acc, card, index) => {
      const id = index.toString()
      acc[id] = { ...card, lesson_id: card_to_lesson_id_map[card.id] || "" }
      return acc
    },
    {} as Record<string, CardEntity & { lesson_id: string }>,
  )
})
```

### Using the View Mapping

**Example: Updating Cards** (`ai_assistant_actions.ts:42-69`):

```typescript
export const update_cards = createAsyncThunk(
  "ai_assistant/update_cards",
  async (params, { getState, dispatch }) => {
    const state = getState()
    const cards = state.ai_assistant.view.cards

    // AI sends: { id: "0", front: "Updated", back: "Updated" }
    // We translate "0" → real UUID
    for (const card of params.cards) {
      dispatch(
        deck_update_actions.update_card({
          id: cards[card.id].id, // Translate "0" to actual UUID
          field: "front",
          value: card.front,
        }),
      )
    }
  },
)
```

**Example: Moving Cards to Lesson** (`ai_assistant_actions.ts:152-170`):

```typescript
export const move_cards_to_a_lesson = createAsyncThunk(
  "ai_assistant/move_cards_to_a_lesson",
  async (params, { getState, dispatch }) => {
    const state = getState()
    const cards = state.ai_assistant.view.cards
    const lessons = state.ai_assistant.view.lessons

    // AI sends: { card_ids: ["0", "1"], lesson_id: "2" }
    // We translate both card IDs and lesson ID to real UUIDs
    dispatch(
      deck_update_actions.move_cards_to_a_lesson({
        card_ids: params.card_ids.map((card_id) => cards[card_id].id),
        lesson_id: lessons[params.lesson_id].id,
      }),
    )
  },
)
```

## Benefits

1. **Reduced Token Usage**: Sending `"0"` instead of `"550e8400-e29b-41d4-a716-446655440000"` saves ~35 characters per reference. For 100 cards, that's ~3,500 characters saved.

2. **Better AI Performance**: AI models work better with simple, sequential IDs. They can more easily understand relationships and make fewer errors.

3. **Cleaner Context**: The context sent to AI is more readable and easier to understand, leading to better AI responses.

4. **Type Safety**: The view mapping ensures we always have a valid translation between AI IDs and real UUIDs, preventing runtime errors.

5. **Isolation**: The AI never needs to know about our internal UUID system, creating a clean abstraction layer.

## Trade-offs

- **State Management**: We need to maintain the view mapping in Redux state, which adds some complexity.
- **Mapping Creation**: We need to create the mapping each time we send context to the AI (though this is fast).
- **Temporary Nature**: The view mapping is session-specific and doesn't persist across page reloads (which is actually desirable for security).

## Conclusion

The view mapping system is a necessary abstraction that makes AI integration more efficient, reliable, and cost-effective. By translating between simple, AI-friendly IDs and our internal UUIDs, we create a better experience for both the AI model and our application.

import "dotenv/config"
import fs from "node:fs"
import path from "node:path"
import { randomUUID } from "node:crypto"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

type CardEntity = {
  id: string
  deck_id: string
  front: string
  back: string
}

type DeckEntity = {
  id: string
  name: string
  origin_language: string
  learning_language: string
  user_id: string
  updated_at: string
  created_at: string
  visibility: "public" | "private" | "unlisted"
  number_of_cards: number
}

type DeckFile = {
  deck: DeckEntity
  cards: CardEntity[]
}

const INPUT_FILE = process.env.BASE_DECK_PATH
  ? path.resolve(process.env.BASE_DECK_PATH)
  : path.resolve("src", "database", "korean_deck_processed.json")
const OUTPUT_FILE = process.env.OUTPUT_FILE
  ? path.resolve(process.env.OUTPUT_FILE)
  : path.resolve(
      "src",
      "database",
      `korean_sentence_deck_${
        new Date().toISOString().replaceAll(":", "-").split(".")[0]
      }.json`,
    )
const SENTENCE_COUNT = Number(process.env.SENTENCE_COUNT || 100)

const GeneratedCardSchema = z.object({
  front_fr: z.string().min(3),
  back_ko: z.string().min(1),
})

const GeneratedBatchSchema = z.object({
  cards: z.array(GeneratedCardSchema).min(1),
})

async function generateFrenchKoreanSentenceBatch(
  baseVocabulary: Array<{ ko: string; fr: string }>,
  count: number,
): Promise<Array<{ front_fr: string; back_ko: string }>> {
  // Keep prompt compact and deterministic
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    system:
      "You write CEFR A2-B1 level bilingual flashcards as natural sentences. Return strictly JSON only.",
    prompt: JSON.stringify({
      task: "Create unique sentence flashcards using Korean sentences and French fronts.",
      constraints: [
        "Use vocabulary from the provided list when natural; you may add common glue words.",
        "Front must be French: a natural, concise sentence (<=120 chars).",
        "Back must be Korean: a natural sentence (<=120 chars) matching the French meaning.",
        "Keep register neutral and natural, no romanization, no quotes, no punctuation outside sentence.",
        "Avoid named entities, profanity, politics. Avoid duplicates and trivial variants.",
      ],
      from: "fr",
      to: "ko",
      count,
      base_vocabulary: baseVocabulary.slice(0, 300),
      examples: [
        {
          front_fr: "Je vais au marché ce matin.",
          back_ko: "오늘 아침에 시장에 가요.",
        },
        {
          front_fr: "Ce livre est trop lourd pour moi.",
          back_ko: "이 책은 나에게 너무 무거워요.",
        },
      ],
    }),
    schema: GeneratedBatchSchema,
  })

  return object.cards
}

function pickVocabulary(deck: DeckFile, max: number) {
  const uniques = new Map<string, string>()
  for (const c of deck.cards) {
    const ko = String(c.front || "").trim()
    const fr = String(c.back || "").trim()
    if (!ko || !fr) continue
    if (!uniques.has(ko)) uniques.set(ko, fr)
    if (uniques.size >= max) break
  }
  return Array.from(uniques.entries()).map(([ko, fr]) => ({ ko, fr }))
}

async function main() {
  const raw = fs.readFileSync(INPUT_FILE, "utf8")
  const baseDeck = JSON.parse(raw) as DeckFile

  if (!baseDeck?.deck || !Array.isArray(baseDeck.cards)) {
    throw new Error("Invalid base deck file")
  }

  const newDeckId = randomUUID()
  const ts = new Date().toISOString()

  const vocabulary = pickVocabulary(baseDeck, 2000)

  const batch = await generateFrenchKoreanSentenceBatch(
    vocabulary,
    SENTENCE_COUNT,
  )

  const cards: CardEntity[] = batch.map((b) => ({
    id: randomUUID(),
    deck_id: newDeckId,
    front: b.front_fr.trim(),
    back: b.back_ko.trim(),
  }))

  const deck: DeckEntity = {
    id: newDeckId,
    name: `${baseDeck.deck.learning_language.toUpperCase()} Sentences (FR→KO)`,
    origin_language: "fr",
    learning_language: "ko",
    user_id: baseDeck.deck.user_id || "system",
    updated_at: ts,
    created_at: ts,
    visibility: "unlisted",
    number_of_cards: cards.length,
  }

  const out: DeckFile = { deck, cards }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(out, null, 2))

  // eslint-disable-next-line no-console
  console.log(`Wrote sentence deck: ${OUTPUT_FILE}`)
}

main().catch((err) => {
   
  console.error(err)
  process.exit(1)
})

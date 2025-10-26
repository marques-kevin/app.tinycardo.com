import "dotenv/config"
import fs from "node:fs"
import path from "node:path"
import { openai } from "@ai-sdk/openai"
import { generateText, generateObject } from "ai"
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
  visibility: "public" | "private" | "unlisted" | "private"
  number_of_cards: number
}

type DeckFile = {
  deck: DeckEntity
  cards: CardEntity[]
}

const FILE_PATH = path.resolve("src", "database", "korean_deck_processed.json")
const BATCH_SIZE = Number(process.env.TRANSLATE_BATCH_SIZE || 10)
const MAX_CARDS = process.env.MAX_CARDS
  ? Number(process.env.MAX_CARDS)
  : undefined
const CORRECT_AND_TRANSLATE = true

async function translateKoToFr(
  koreanText: string,
  englishHint?: string,
): Promise<string> {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    system:
      "You are a professional translator converting Korean dictionary headwords into concise French for flashcards. Return ONLY the French translation.",
    prompt: JSON.stringify({
      instructions:
        "Rules: verbs -> infinitive (aller, faire). Stative adjectives (~다) -> 'être X' (e.g., 가깝다 -> être proche). Nouns -> noun only. Adverbs -> adverb. Avoid explanations, punctuation, quotes, gender lists; give a single best translation.",
      from: "ko",
      to: "fr",
      text: koreanText,
      english_hint: englishHint ?? null,
    }),
  })

  return text.trim()
}

async function correctAndTranslateKoToFr(
  front: string,
  back?: string,
): Promise<{ frontKo: string; backFr: string; updateBack: boolean }> {
  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      system:
        "You are a professional lexicographer. Normalize Korean headwords and validate an existing French translation for flashcards.",
      prompt: JSON.stringify({
        task: "Given a card with front (Korean or possibly swapped) and an existing back in FRENCH, fix mistakes, detect if swapped, normalize the Korean headword to dictionary lemma, and only change the French back if it is clearly wrong or if swap is detected.",
        rules:
          "Front must be a single Korean dictionary headword. Keep ~다 for verbs/adjectives. Remove punctuation/spaces. Prefer preserving the provided French back if it is already a correct concise translation for the Korean headword. Verbs -> infinitive; stative adjectives as 'être X'. If multiple common French alternatives exist (e.g., register/politeness or synonyms), provide up to 3 concise variants, most common first. No explanations, quotes, or gender lists.",
        input: { front_input: front, back_fr_input: back ?? null },
      }),
      schema: z.object({
        front_ko: z.string().min(1),
        back_fr: z.string().optional(),
        back_fr_list: z.array(z.string().min(1)).min(1).max(3).optional(),
        update_back: z.boolean(),
      }),
    })

    const frontKo: string = String(object.front_ko ?? "").trim()
    const variants = Array.isArray(object.back_fr_list)
      ? object.back_fr_list
          .map((s: unknown) => String(s ?? "").trim())
          .filter(Boolean)
      : undefined
    const backFr: string =
      variants && variants.length
        ? variants.join(" | ")
        : String(object.back_fr ?? "").trim()
    const updateBack: boolean = Boolean(object.update_back)

    if (frontKo && backFr) {
      return { frontKo, backFr, updateBack }
    }
  } catch {
    // ignore and fallback
  }

  // Fallback: keep existing values, do not overwrite French back
  return { frontKo: front, backFr: back ?? "", updateBack: false }
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

async function main() {
  const raw = fs.readFileSync(FILE_PATH, "utf8")
  const data = JSON.parse(raw) as DeckFile

  if (!data || !Array.isArray(data.cards)) {
    throw new Error("Invalid deck file: missing cards array")
  }

  // Update deck origin language to French since 'back' will be in French
  if (data.deck && data.deck.origin_language !== "fr") {
    data.deck.origin_language = "fr"
  }

  const allCards = Array.isArray(data.cards) ? data.cards : []
  const subset =
    typeof MAX_CARDS === "number" && Number.isFinite(MAX_CARDS)
      ? allCards.slice(0, Math.max(0, MAX_CARDS))
      : allCards

  const chunks = chunkArray(subset, BATCH_SIZE)
  let processed = 0

  for (const batch of chunks) {
    if (CORRECT_AND_TRANSLATE) {
      const results = await Promise.all(
        batch.map((card) => correctAndTranslateKoToFr(card.front, card.back)),
      )

      results.forEach((res, idx) => {
        batch[idx].front = res.frontKo
        if (res.updateBack) {
          batch[idx].back = res.backFr
        }
      })
    } else {
      const translations = await Promise.all(
        batch.map((card) => translateKoToFr(card.front, card.back)),
      )

      translations.forEach((translated, idx) => {
        batch[idx].back = translated
      })
    }

    processed += batch.length
    // eslint-disable-next-line no-console
    console.log(`Translated ${processed}/${subset.length}`)
  }

  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2))

  // Also write a timestamped copy next to the original file
  const dir = path.dirname(FILE_PATH)
  const ext = path.extname(FILE_PATH)
  const base = path.basename(FILE_PATH, ext)
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`
  const datedPath = path.join(dir, `${base}_${timestamp}${ext}`)
  fs.writeFileSync(datedPath, JSON.stringify(data, null, 2))
  // eslint-disable-next-line no-console
  console.log(
    "Finished updating korean_deck_processed.json with French translations.",
  )
  // eslint-disable-next-line no-console
  console.log(`Created dated copy: ${datedPath}`)
}

// Run
main().catch((err) => {
   
  console.error(err)
  process.exit(1)
})

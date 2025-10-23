import restore from "@/i18n/.keep/restore.en.json"
import { languages_ids } from "@/i18n/languages"
import en from "@/i18n/messages/en.json"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import dotenv from "dotenv"
import { promises as fs } from "fs"
import path from "path"

dotenv.config()

const translate = async (params: {
  text: string
  to: string
  from: string
  text_key: string
}) => {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    system: `
    You translate UI strings for Tinycardo — a flashcard app. I will send JSON with { from, to, text, text_key }. Translate from the source language to the target language.

Style and tone:
- Concise, sarcastic, and always funny and familiar.
- Prefer clear action verbs for buttons/labels (e.g., translate “Save” as a single imperative verb).
- Use consistent terminology across the app.

Domain and terminology:
- Do NOT translate product/technical names: Tinycardo, React, Redux, TypeScript, Tailwind CSS, Vite.
- Translate common UI/domain terms consistently: flashcard, session, review, review session, deck, card, front, back, new, history, streak, next due, mastered, forgotten.
- Time windows used in the app (e.g., “last 24 hours”, “last 72 hours”) should be translated naturally.

Formatting rules:
- Return ONLY the translated string. No quotes, no explanations.
- Preserve placeholders, variables, and formatting exactly: {count}, {date}, {muscle}, %{value}, {{name}}, <b>...</b>, <i>...</i>, <br>, \n.
- Preserve punctuation, emojis, and capitalization where they are meaningful for UI.
- Do not add or remove words; do not re-order placeholders.
- If units/dates are literal text, localize them (e.g., “24 hours”); if they are placeholders, leave formatting to the app.

Consistency:
- Keep decisions consistent within the target language for: “cards” vs. “flashcards” (prefer the most natural equivalent in the target language and use it everywhere).
- Use sentence case for short labels; use the target language’s normal title capitalization for headings.

Edge cases:
- If the source is already localized or brand-like, keep it as is.
- If the string is a single word or very short label, translate with the shortest natural UI form.

    `,

    prompt: JSON.stringify({
      from: params.from,
      to: params.to,
      text_key: params.text_key,
      text: params.text,
    }),
  })

  return text
}

async function storeFile(json: Record<string, string>, lang: string) {
  const dir = path.resolve("src/i18n/messages/", `${lang}.json`)
  await fs.writeFile(dir, JSON.stringify(json, null, 2), "utf-8")
}

async function compareNewKeys() {
  const keysThatHaveBeenCreated = Object.keys(en).filter(
    (key) => !(key in restore),
  )

  const keysThatHaveBeenDeleted = Object.keys(restore).filter(
    (key) => !(key in en),
  )

  const keysThatHaveBeenModified = Object.keys(en).filter((key) => {
    const valueInEnglish = en[key as keyof typeof en]
    const valueInRestored = restore[key as keyof typeof restore]

    if (valueInEnglish && valueInRestored) {
      return valueInEnglish !== valueInRestored
    }

    return false
  })

  return {
    created: keysThatHaveBeenCreated.map((key) => ({
      key,
      value: en[key as keyof typeof en],
      lang: "en",
    })),
    modified: keysThatHaveBeenModified.map((key) => ({
      key,
      value: en[key as keyof typeof en],
      lang: "en",
    })),
    deleted: keysThatHaveBeenDeleted,
  }
}

async function loadFile(lang: string) {
  return JSON.parse(
    await fs.readFile(`src/i18n/messages/${lang}.json`, "utf-8"),
  ) as Record<string, string>
}

async function removeRemovedKeys(removedKeys: string[], lang: string) {
  console.info(`Removing keys: ${removedKeys.join(", ")} from ${lang}`)

  const file = await loadFile(lang)

  const keysFromFile = Object.keys(file)
  const newFile: Record<string, string> = {}

  keysFromFile.forEach((key) => {
    if (!removedKeys.includes(key)) {
      newFile[key] = file[key]
    }
  })

  await storeFile(newFile, lang)
}

async function addCreatedKeys(
  createdKeys: Array<{ key: string; value: string; lang: string }>,
  lang: string,
) {
  console.info(
    `Adding keys: ${createdKeys.map((k) => k.key).join(", ")} to ${lang}`,
  )
  const imported = await loadFile(lang)

  const file = { ...imported }

  for (const key of createdKeys) {
    file[`${key.key}`] = await translate({
      text: key.value,
      to: lang,
      from: key.lang,
      text_key: key.key,
    })
  }

  await storeFile(file, lang)
}

async function updateModifiedKeys(
  modifiedKeys: Array<{ key: string; value: string; lang: string }>,
  lang: string,
) {
  console.info(
    `Updating keys: ${modifiedKeys.map((k) => k.key).join(", ")} in ${lang}`,
  )

  const imported = await loadFile(lang)

  const file = { ...imported }

  for (const key of modifiedKeys) {
    file[`${key.key}`] = await translate({
      text: key.value,
      to: lang,
      from: key.lang,
      text_key: key.key,
    })
  }

  await storeFile(file, lang)
}

async function storeRestoreFile() {
  const file = await loadFile("en")

  const dir = path.resolve("src/i18n/.keep/restore.en.json")
  await fs.writeFile(dir, JSON.stringify(file), "utf-8")
}

async function main() {
  const { created, deleted, modified } = await compareNewKeys()

  for (const lang of languages_ids.filter((lang) => lang !== "en")) {
    if (deleted.length > 0) {
      await removeRemovedKeys(deleted, lang)
    } else {
      console.info(`No keys to remove`)
    }

    if (created.length > 0) {
      await addCreatedKeys(created, lang)
    } else {
      console.info(`No keys to add`)
    }

    if (modified.length > 0) {
      await updateModifiedKeys(modified, lang)
    } else {
      console.info(`No keys to update`)
    }
  }

  await storeRestoreFile()
}

async function getAllKeys() {
  const en = await loadFile("en")

  return Object.keys(en).map((key) => ({
    key,
    value: en[key as keyof typeof en],
    lang: "en",
  }))
}

export async function addNewLanguage(lang: string) {
  const allKeys = await getAllKeys()

  await addCreatedKeys(allKeys, lang)
}

main()

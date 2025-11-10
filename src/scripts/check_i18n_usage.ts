import fs from "node:fs/promises"
import path from "node:path"
import fg from "fast-glob"

type Messages = Record<string, unknown>

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

async function loadMessages(filePath: string): Promise<string[]> {
  const raw = await fs.readFile(filePath, "utf8")
  const parsed = JSON.parse(raw) as Messages

  if (!isRecord(parsed)) {
    throw new Error(`Expected ${filePath} to export a flat object of keys`)
  }

  return Object.keys(parsed)
}

async function findKeyUsages(
  keys: string[],
  sourceGlobs: string[],
  ignoredGlobs: string[],
): Promise<Map<string, string[]>> {
  const files = await fg(sourceGlobs, {
    cwd: process.cwd(),
    absolute: true,
    ignore: ignoredGlobs,
  })

  const usage = new Map<string, string[]>(keys.map((key) => [key, []]))
  const pending = new Set(keys)

  for (const filePath of files) {
    if (pending.size === 0) {
      break
    }

    const content = await fs.readFile(filePath, "utf8")

    for (const key of Array.from(pending)) {
      if (content.includes(key)) {
        usage.get(key)!.push(filePath)
        pending.delete(key)
      }
    }
  }

  return usage
}

function logResults(usage: Map<string, string[]>) {
  const unused: string[] = []
  const used: string[] = []

  usage.forEach((files, key) => {
    if (files.length > 0) {
      used.push(key)
    } else {
      unused.push(key)
    }
  })

  console.info(`Checked ${usage.size} keys.`)
  console.info(`Used keys: ${used.length}`)
  console.info(`Unused keys: ${unused.length}`)

  if (unused.length > 0) {
    console.info("\nUnused keys:")
    unused.forEach((key) => {
      console.info(`- ${key}`)
    })
    throw new Error(
      `Found ${unused.length} unused i18n ${unused.length === 1 ? "key" : "keys"} in en.json`,
    )
  } else {
    console.info("\nAll keys from en.json are referenced outside src/i18n.")
  }
}

async function main() {
  const messagesPath = path.resolve("src", "i18n", "messages", "en.json")
  const keys = await loadMessages(messagesPath)

  if (keys.length === 0) {
    console.warn("No keys found in en.json.")
    return
  }

  const usage = await findKeyUsages(
    keys,
    ["src/**/*.{ts,tsx,js,jsx,json,md,mdx}"],
    ["src/i18n/**"],
  )

  logResults(usage)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})

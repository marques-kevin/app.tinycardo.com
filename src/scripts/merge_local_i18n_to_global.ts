// ./src/scripts/merge-i18n.ts
import fs from "node:fs"
import path from "node:path"
import fg from "fast-glob"
import chokidar from "chokidar"

type JsonValue = string | number | boolean | null | JsonObject | JsonArray
interface JsonObject {
  [key: string]: JsonValue
}
interface JsonArray extends Array<JsonValue> {}

const src_root = path.resolve(process.cwd(), "src")
const output_path = path.resolve(src_root, "i18n/messages/en.json")
const glob_pattern = "**/*.i18n.json"

// --- utils --------------------------------------------------------------

function is_object(v: unknown): v is JsonObject {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

function ensure_dir_for(file_path: string) {
  const dir = path.dirname(file_path)
  fs.mkdirSync(dir, { recursive: true })
}

function read_json(file: string): JsonObject {
  const raw = fs.readFileSync(file, "utf8")
  try {
    const parsed = JSON.parse(raw)
    if (!is_object(parsed)) throw new Error("root must be an object")
    return parsed
  } catch (e) {
    const error = e as Error

    throw new Error(`Invalid JSON in ${file}: ${error.message}`)
  }
}

/**
 * Aplati un objet JSON en clés "a/b/c" (ignores arrays as branches).
 * Seules les feuilles de type string | number | boolean | null sont gardées.
 */
function flatten_with_prefix(
  input: JsonObject,
  prefix: string,
): Record<string, string | number | boolean | null> {
  const out: Record<string, string | number | boolean | null> = {}

  const walk = (node: JsonValue, parts: string[]) => {
    if (is_object(node)) {
      for (const [k, v] of Object.entries(node)) {
        walk(v, [...parts, k])
      }
      return
    }

    // On ne mappe que les feuilles scalaires / null
    if (
      typeof node === "string" ||
      typeof node === "number" ||
      typeof node === "boolean" ||
      node === null
    ) {
      const key = [prefix, ...parts].join("/")
      out[key] = node
      return
    }

    // Si c'est un tableau ou autre, on ignore mais on pourrait logger:
    // console.warn(`Skipping non-scalar at ${[prefix, ...parts].join("/")}`);
  }

  walk(input, [])
  return out
}

function sort_keys<T extends Record<string, unknown>>(obj: T): T {
  const sorted_entries = Object.keys(obj)
    .sort((a, b) => a.localeCompare(b))
    .map((k) => [k, obj[k]])
  return Object.fromEntries(sorted_entries) as T
}

// --- core ---------------------------------------------------------------

async function collect_i18n_files(): Promise<string[]> {
  const files = await fg(glob_pattern, {
    cwd: src_root,
    absolute: true,
    ignore: [
      path.relative(src_root, output_path),
      "node_modules",
      "dist",
      "build",
      ".vite",
    ],
  })

  return files.filter((f) => path.resolve(f) !== output_path)
}

function file_namespace(file_path: string): string {
  const base = path.basename(file_path)
  // retire la terminaison ".i18n.json"
  return base.replace(/\.i18n\.json$/i, "")
}

async function merge_all(): Promise<{
  merged: Record<string, string | number | boolean | null>
  files: string[]
  conflicts: string[]
}> {
  const files = await collect_i18n_files()
  const merged: Record<string, string | number | boolean | null> = {}
  const conflicts: string[] = []

  for (const file of files) {
    const ns = file_namespace(file)
    const json = read_json(file)
    const flat = flatten_with_prefix(json, ns)

    for (const [k, v] of Object.entries(flat)) {
      if (k in merged && merged[k] !== v) {
        conflicts.push(k)
      }
      merged[k] = v
    }
  }

  return { merged: sort_keys(merged), files, conflicts }
}

function write_output(json: Record<string, string | number | boolean | null>) {
  ensure_dir_for(output_path)
  const pretty = JSON.stringify(json, null, 2) + "\n"
  fs.writeFileSync(output_path, pretty, "utf8")
}

// --- CLI + Watch --------------------------------------------------------

async function run_once() {
  const start = Date.now()
  const { merged, files, conflicts } = await merge_all()
  write_output(merged)

  const ms = Date.now() - start
  console.info(
    `✅ Merged ${files.length} file(s) into ${path.relative(process.cwd(), output_path)} in ${ms}ms`,
  )

  if (conflicts.length) {
    console.info(
      `⚠️  ${conflicts.length} conflicting key(s) (last write wins):`,
    )
    for (const k of conflicts.slice(0, 10)) console.info(`  - ${k}`)
    if (conflicts.length > 10)
      console.info(`  …and ${conflicts.length - 10} more`)
  }
}

async function run_watch() {
  await run_once()

  const watcher = chokidar.watch(".", {
    cwd: src_root,
    persistent: true,
    ignoreInitial: true,
    ignored: [
      path.relative(src_root, output_path),
      output_path,
      /node_modules|dist|build|\.vite/,
    ],
    awaitWriteFinish: { stabilityThreshold: 200, pollInterval: 50 },
  })

  let timer: NodeJS.Timeout | null = null
  const debounce = () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      run_once().catch((e) => console.error(e))
    }, 150)
  }

  watcher.on("all", (_event, filePath) => {
    // filePath is relative to src_root due to cwd
    if (filePath.endsWith(".i18n.json")) {
      debounce()
    }
  })

  console.info("👀 Watching for changes in *.i18n.json …")
}

const is_watch = process.argv.includes("--watch")
;(is_watch ? run_watch() : run_once()).catch((e) => {
  console.error("❌ i18n merge failed:")
  console.error(e)
  process.exit(1)
})

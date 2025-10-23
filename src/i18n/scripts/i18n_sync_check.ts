import { promises as fs } from "fs"
import path from "path"

async function i18n_sync_check() {
  try {
    const en_path = path.resolve("src/i18n/messages/en.json")
    const restore_path = path.resolve("src/i18n/.keep/restore.en.json")

    const en_content = await fs.readFile(en_path, "utf-8")
    const restore_content = await fs.readFile(restore_path, "utf-8")

    console.info("en_content:", en_content)
    console.info("restore_content:", restore_content)

    const en_json = JSON.parse(en_content)
    const restore_json = JSON.parse(restore_content)

    // Get all keys from both files
    const en_keys = Object.keys(en_json)
    const restore_keys = Object.keys(restore_json)

    // Check for missing keys in restore
    const missing_in_restore = en_keys.filter((key) => !(key in restore_json))

    // Check for extra keys in restore
    const extra_in_restore = restore_keys.filter((key) => !(key in en_json))

    // Check for different values
    const different_values = en_keys.filter((key) => {
      if (!(key in restore_json)) return false
      return en_json[key] !== restore_json[key]
    })

    // Build error message if there are differences
    if (
      missing_in_restore.length > 0 ||
      extra_in_restore.length > 0 ||
      different_values.length > 0
    ) {
      let error_message = "i18n files are not in sync!\n\n"

      if (missing_in_restore.length > 0) {
        error_message += `Missing keys in restore.en.json (${missing_in_restore.length}):\n`
        error_message +=
          missing_in_restore.map((key) => `  - ${key}`).join("\n") + "\n\n"
      }

      if (extra_in_restore.length > 0) {
        error_message += `Extra keys in restore.en.json (${extra_in_restore.length}):\n`
        error_message +=
          extra_in_restore.map((key) => `  - ${key}`).join("\n") + "\n\n"
      }

      if (different_values.length > 0) {
        error_message += `Different values (${different_values.length}):\n`
        different_values.forEach((key) => {
          error_message += `  - ${key}:\n`
          error_message += `    en.json: "${en_json[key]}"\n`
          error_message += `    restore.en.json: "${restore_json[key]}"\n`
        })
        error_message += "\n"
      }

      error_message += "To fix this, run: yarn i18n:translate"

      console.error(error_message)
      process.exit(1)
    }

    console.info("✅ i18n files are in sync!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Error checking i18n sync:", error)
    process.exit(1)
  }
}

i18n_sync_check()

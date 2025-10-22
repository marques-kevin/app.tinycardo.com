function parse_csv_line(line: string, delimiter: string): string[] {
  const result: string[] = []
  let current = ""
  let in_quotes = false
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    if (char === '"') {
      if (in_quotes && line[i + 1] === '"') {
        current += '"'
        i += 1
      } else {
        in_quotes = !in_quotes
      }
    } else if (char === delimiter && !in_quotes) {
      result.push(current)
      current = ""
    } else {
      current += char
    }
  }
  result.push(current)
  return result.map((s) => s.trim())
}

function get_delimiter(csv: string): string {
  if (csv.includes("\t")) return "\t"
  if (csv.includes(";")) return ";"
  return ","
}

export function parse_csv_to_json(csv: string): {
  headers: string[]
  rows: Record<string, string>[]
} {
  const delimiter = get_delimiter(csv)

  const headerLine = csv.split("\n")[0]
  const rows = csv.split("\n").slice(1)
  const headers = parse_csv_line(headerLine, delimiter).map((s) =>
    s.toLowerCase(),
  )

  return {
    headers,
    rows: rows.map((line) =>
      parse_csv_line(line, delimiter).reduce(
        (acc, curr, index) => {
          acc[headers[index]] = curr
          return acc
        },
        {} as Record<string, string>,
      ),
    ),
  }
}

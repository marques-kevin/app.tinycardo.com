export const emoji_flags: Record<string, string> = {
  en: "🇬🇧",
  fr: "🇫🇷",
  pt: "🇵🇹",
  es: "🇪🇸",
  de: "🇩🇪",
  it: "🇮🇹",
  ja: "🇯🇵",
  ko: "🇰🇷",
  ru: "🇷🇺",
  tr: "🇹🇷",
  zh: "🇨🇳",
  ar: "🇸🇦",
}

export function getEmojiFlag(code: string): string {
  return emoji_flags[code] ?? "🏳️"
}

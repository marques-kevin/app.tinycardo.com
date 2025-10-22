import en from "@/i18n/messages/en.json"

export type MessageI18nKeys = keyof typeof en

declare global {
  namespace FormatjsIntl {
    interface Message {
      ids: MessageI18nKeys
    }
  }
}

import dayjs from "dayjs"
import "dayjs/locale/ar"
import "dayjs/locale/de"
import "dayjs/locale/en"
import "dayjs/locale/es"
import "dayjs/locale/fr"
import "dayjs/locale/it"
import "dayjs/locale/ja"
import "dayjs/locale/ko"
import "dayjs/locale/pt"
import "dayjs/locale/ru"
import "dayjs/locale/tr"
import "dayjs/locale/zh"

import ar from "@/i18n/messages/ar.json"
import de from "@/i18n/messages/de.json"
import en from "@/i18n/messages/en.json"
import es from "@/i18n/messages/es.json"
import fr from "@/i18n/messages/fr.json"
import it from "@/i18n/messages/it.json"
import ja from "@/i18n/messages/ja.json"
import ko from "@/i18n/messages/ko.json"
import pt from "@/i18n/messages/pt.json"
import ru from "@/i18n/messages/ru.json"
import tr from "@/i18n/messages/tr.json"
import zh from "@/i18n/messages/zh.json"
import React, { useEffect } from "react"
import { IntlProvider } from "react-intl"

import { LOCAL_STORAGE_KEYS } from "@/modules/global/services/localstorage_service/localstorage_service"
import {
  connector,
  type ContainerProps,
} from "@/modules/language/components/language_intl_provider/language_intl_provider.containers"

const messages = { en, fr, it, es, de, ja, ko, pt, ru, tr, zh, ar }

const getLangFromNavigator = () => {
  try {
    const browserLang = navigator.language.split("-")[0]

    if (messages[browserLang as keyof typeof messages]) return browserLang
    return "en"
  } catch {
    return "en"
  }
}

const getLangFromLocalstorage = () => {
  try {
    const lang = localStorage.getItem(LOCAL_STORAGE_KEYS.language)

    if (lang && messages[lang as keyof typeof messages]) return lang
    return null
  } catch {
    return null
  }
}

const setDayjsLocale = (lang: string) => {
  dayjs.locale(lang)
}

export const Wrapper: React.FC<ContainerProps> = (props) => {
  const lang = getLangFromLocalstorage() || getLangFromNavigator()

  setDayjsLocale(lang)

  useEffect(() => {
    props.onMount(lang)
  }, [])

  return (
    <IntlProvider
      locale={lang}
      messages={
        messages[lang as keyof typeof messages] as Record<string, string>
      }
    >
      {props.children}
    </IntlProvider>
  )
}

export const LanguageIntlProvider = connector(Wrapper)

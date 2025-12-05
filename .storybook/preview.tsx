import "../src/css/index.css"
import React from "react"
import type { Preview } from "@storybook/react-vite"
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
import { IntlProvider } from "react-intl"

import ar from "../src/i18n/messages/ar.json"
import de from "../src/i18n/messages/de.json"
import en from "../src/i18n/messages/en.json"
import es from "../src/i18n/messages/es.json"
import fr from "../src/i18n/messages/fr.json"
import it from "../src/i18n/messages/it.json"
import ja from "../src/i18n/messages/ja.json"
import ko from "../src/i18n/messages/ko.json"
import pt from "../src/i18n/messages/pt.json"
import ru from "../src/i18n/messages/ru.json"
import tr from "../src/i18n/messages/tr.json"
import zh from "../src/i18n/messages/zh.json"

import { languages_ids } from "../src/i18n/languages"

import { MemoryRouter } from "react-router-dom"
import { THEMES } from "../src/modules/params/constants/themes"
import { init } from "../src/redux/store"
import { build_dependencies } from "../src/redux/dependencies"
import { Provider } from "react-redux"

const messages = { en, fr, it, es, de, ja, ko, pt, ru, tr, zh, ar } as const

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    locale: {
      name: "Locale",
      description: "Internationalization locale",
      defaultValue: "en",
      toolbar: {
        icon: "globe",
        items: languages_ids,
        showName: true,
        dynamicTitle: true,
      },
    },
    theme: {
      name: "Theme",
      description: "Theme",
      defaultValue: "light",
      toolbar: {
        icon: "paintbrush",
        items: THEMES,
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const locale = (context.globals.locale as keyof typeof messages) || "en"
      const dir = locale === "ar" ? "rtl" : "ltr"
      const theme = context.globals.theme || "cupcake"

      const { store } = init({}, build_dependencies("test"))

      if (typeof document !== "undefined") {
        document.documentElement.lang = locale
        document.documentElement.dir = dir
        document.documentElement.setAttribute("data-theme", theme)
      }

      dayjs.locale(locale)

      return (
        <IntlProvider locale={locale} messages={messages[locale]}>
          <Provider store={store}>
            <MemoryRouter initialEntries={["/"]}>
              <Story />
            </MemoryRouter>
          </Provider>
        </IntlProvider>
      )
    },
  ],
}

export default preview

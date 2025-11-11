import { useIntl } from "react-intl"
import { languages } from "@/i18n/languages"
import {
  connector,
  type ContainerProps,
} from "@/modules/discover/components/discover_decks_filters/discover_decks_filters.containers"

type LanguageOption = (typeof languages)[number]

function LanguageSelect(props: {
  id: string
  value: string
  onChange: (value: string) => void
  options: LanguageOption[]
}) {
  return (
    <label htmlFor={props.id} className="relative flex items-center">
      <select
        id={props.id}
        value={props.value}
        className="select select-bordered select-lg pl-12"
        onChange={(event) => props.onChange(event.target.value)}
      >
        {props.options.map((option) => (
          <option key={option.id} value={option.id}>
            <img
              src={`/flags/${option.id}.svg`}
              alt={option.label}
              className="h-6 w-6 rounded-full object-cover"
            />
            {option.label}
          </option>
        ))}
      </select>

      <div className="pointer-events-none absolute top-0 right-0 bottom-0 left-0 z-10 flex items-center px-4">
        <img
          src={`/flags/${props.value}.svg`}
          alt={props.value}
          className="h-6 w-6 rounded-full object-cover"
        />
      </div>
    </label>
  )
}

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()

  return (
    <div className="flex flex-col gap-3 text-lg font-medium lg:flex-row lg:items-center">
      {formatMessage(
        { id: "discover_decks_filters/message" },
        {
          spoken_language: () => (
            <LanguageSelect
              id="discover-decks-filters-spoken-language"
              value={props.spoken_language}
              options={languages}
              onChange={(value) =>
                props.on_change_filters({
                  spoken_language: value,
                  learning_language: props.learning_language,
                })
              }
            />
          ),
          learning_language: () => (
            <LanguageSelect
              id="discover-decks-filters-learning-language"
              value={props.learning_language}
              options={languages}
              onChange={(value) =>
                props.on_change_filters({
                  spoken_language: props.spoken_language,
                  learning_language: value,
                })
              }
            />
          ),
        },
      )}
    </div>
  )
}

export const DiscoverDecksFilters = connector(Wrapper)

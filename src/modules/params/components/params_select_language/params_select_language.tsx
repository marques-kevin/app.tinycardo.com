import { languages } from "@/i18n/languages"
import {
  connector,
  type ContainerProps,
} from "@/modules/params/components/params_select_language/params_select_language.containers"
import { useIntl } from "react-intl"
import { ParamsSection } from "../params_section/params_section"

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()
  const { value, on_change } = props

  return (
    <ParamsSection
      title={formatMessage({ id: "params_select_language/section/title" })}
      description={formatMessage({
        id: "params_select_language/section/description",
      })}
    >
      <select
        className="select"
        value={value}
        onChange={(e) => on_change(e.target.value)}
      >
        {languages.map((l) => (
          <option key={l.id} value={l.id}>
            {l.label}
          </option>
        ))}
      </select>
    </ParamsSection>
  )
}

export const ParamsSelectLanguage = connector(Wrapper)

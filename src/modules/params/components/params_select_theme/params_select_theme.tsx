import {
  connector,
  type ContainerProps,
} from "@/modules/params/components/params_select_theme/params_select_theme.containers"
import { ParamsSection } from "../params_section/params_section"
import { useIntl } from "react-intl"

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()
  const { themes, value, on_change } = props

  return (
    <ParamsSection
      title={formatMessage({ id: "params_select_theme/section/title" })}
      description={formatMessage({
        id: "params_select_theme/section/description",
      })}
    >
      <div className="w-full">
        <div className="flex flex-wrap gap-3">
          {themes.map((t) => (
            <div
              key={t}
              onClick={() => on_change(t)}
              aria-pressed={value === t}
            >
              <div data-theme={t} className="btn btn-lg">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm">{t}</span>
                  <div className="flex items-center gap-1">
                    <span className="bg-primary h-4 w-4 rounded" />
                    <span className="bg-secondary h-4 w-4 rounded" />
                    <span className="bg-accent h-4 w-4 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ParamsSection>
  )
}

export const ParamsSelectTheme = connector(Wrapper)

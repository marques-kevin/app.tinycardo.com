import { connector, type ContainerProps } from "./params_danger_zone.containers"
import { ParamsSection } from "../params_section/params_section"
import { useIntl } from "react-intl"

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()

  return (
    <ParamsSection
      title={formatMessage({ id: "params_danger_zone/section/title" })}
      description={formatMessage({
        id: "params_danger_zone/section/description",
      })}
    >
      <div className="w-full">
        <button
          className="btn btn-lg btn-error"
          onClick={props.on_delete_all_data}
        >
          {formatMessage({ id: "params_danger_zone/delete_account_button" })}
        </button>
      </div>
    </ParamsSection>
  )
}

export const ParamsDangerZone = connector(Wrapper)

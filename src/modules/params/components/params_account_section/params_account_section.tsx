import { useIntl } from "react-intl"
import { ParamsSection } from "../params_section/params_section"
import {
  connector,
  type ContainerProps,
} from "./params_account_section.containers"
import { LogOutIcon } from "lucide-react"

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()

  return (
    <ParamsSection
      title={formatMessage({ id: "params_account_section/section/title" })}
      description={formatMessage({
        id: "params_account_section/section/description",
      })}
    >
      <div className="w-full">
        <button
          className="btn btn-lg btn-outline btn-error"
          onClick={props.on_logout}
        >
          <LogOutIcon className="size-5" />
          {formatMessage({ id: "params_account_section/logout_button" })}
        </button>
      </div>
    </ParamsSection>
  )
}

export const ParamsAccountSection = connector(Wrapper)

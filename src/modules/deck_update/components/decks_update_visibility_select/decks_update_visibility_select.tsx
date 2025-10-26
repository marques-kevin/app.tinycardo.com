import {
  connector,
  type ContainerProps,
} from "./decks_update_visibility_select.container"
import { useIntl } from "react-intl"

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()

  return (
    <fieldset className="fieldset">
      <select
        className="select select-lg text-base-content"
        value={props.visibility}
        onChange={(e) =>
          props.on_change(e.target.value as "public" | "private" | "unlisted")
        }
      >
        <option value="public">
          {formatMessage({ id: "decks_update_visibility_select/public" })}
        </option>
        <option value="unlisted">
          {formatMessage({ id: "decks_update_visibility_select/unlisted" })}
        </option>
        <option value="private">
          {formatMessage({ id: "decks_update_visibility_select/private" })}
        </option>
      </select>
    </fieldset>
  )
}

export const DecksUpdateVisibilitySelect = connector(Wrapper)

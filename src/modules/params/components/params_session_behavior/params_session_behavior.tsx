import { ParamsSection } from "../params_section/params_section"
import {
  connector,
  type ContainerProps,
} from "./params_session_behavior.containers"
import { useIntl } from "react-intl"

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()

  return (
    <ParamsSection
      title={formatMessage({ id: "params_session_behavior/section/title" })}
      description={formatMessage({
        id: "params_session_behavior/section/description",
      })}
    >
      <div className="flex w-full flex-col gap-2">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">
            {formatMessage({
              id: "params_session_behavior/how_many_words_to_review/label",
            })}
          </legend>
          <input
            className="input"
            type="number"
            min={1}
            value={props.how_many_words_to_review}
            onChange={(e) =>
              props.on_how_many_words_to_review_change(Number(e.target.value))
            }
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">
            {formatMessage({
              id: "params_session_behavior/how_many_words_to_learn_new_words/label",
            })}
          </legend>
          <input
            type="number"
            className="input"
            min={1}
            value={props.how_many_words_to_learn_new_words}
            onChange={(e) =>
              props.on_how_many_words_to_learn_new_words_change(
                Number(e.target.value),
              )
            }
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">
            {formatMessage({
              id: "params_session_behavior/how_many_words_to_randomized/label",
            })}
          </legend>
          <input
            className="input"
            type="number"
            min={1}
            value={props.how_many_words_to_randomized}
            onChange={(e) =>
              props.on_how_many_words_to_randomized_change(
                Number(e.target.value),
              )
            }
          />
        </fieldset>
      </div>
    </ParamsSection>
  )
}

export const ParamsSelectSessionBehavior = connector(Wrapper)

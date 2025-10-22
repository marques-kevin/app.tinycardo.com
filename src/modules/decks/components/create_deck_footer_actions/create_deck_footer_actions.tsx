import {
  connector,
  type ContainerProps,
} from "@/modules/decks/components/create_deck_footer_actions/create_deck_footer_actions.container"

export function Wrapper(props: ContainerProps) {
  return (
    <div className="flex items-center justify-end">
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={props.on_save}
      >
        Save deck
      </button>
    </div>
  )
}

export const CreateDeckFooterActions = connector(Wrapper)

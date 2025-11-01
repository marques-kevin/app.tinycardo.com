import { useIntl } from "react-intl"
import { useState } from "react"
import { FolderIcon, PlusIcon } from "lucide-react"
import {
  connector,
  type ContainerProps,
} from "./deck_update_add_cards_to_lesson_modal.container"
import { cn } from "@/lib/utils"

export function Wrapper(props: ContainerProps) {
  const [selected_lesson_id, set_selected_lesson_id] = useState<string | null>(
    null,
  )
  const { formatMessage } = useIntl()

  const handle_cancel = () => {
    props.on_close_modal()
  }

  const handle_apply = () => {
    if (selected_lesson_id) {
      props.on_add_to_lesson(selected_lesson_id)
    }
  }

  const handle_radio_change = (lesson_id: string) => {
    set_selected_lesson_id(lesson_id)
  }

  return (
    <dialog className="modal" open={props.is_open} onClose={handle_cancel}>
      <div className="modal-box w-full max-w-2xl space-y-4">
        <FolderIcon className="text-accent-content fill-accent size-8" />

        <header>
          <h3 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            {formatMessage(
              {
                id: "deck_update_add_cards_to_lesson_modal/title",
              },
              { length: props.number_of_selected_cards },
            )}
          </h3>

          <p className="text-base-content/80">
            {formatMessage({
              id: "deck_update_add_cards_to_lesson_modal/description",
            })}
          </p>
        </header>

        <div className="rounded-box border-base-300 w-full border">
          {props.lessons.map((lesson) => (
            <label
              key={lesson.id}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2 p-4",
              )}
            >
              <input
                type="radio"
                name="lesson"
                className="radio"
                checked={selected_lesson_id === lesson.id}
                onChange={() => handle_radio_change(lesson.id)}
              />
              <span>{lesson.name}</span>
            </label>
          ))}
        </div>

        <footer className="modal-action justify-between">
          <button className="btn btn-lg btn-ghost" onClick={handle_cancel}>
            {formatMessage({
              id: "deck_update_add_cards_to_lesson_modal/cancel",
            })}
          </button>
          <button
            className="btn btn-lg btn-primary"
            disabled={!selected_lesson_id}
            onClick={handle_apply}
          >
            {formatMessage(
              {
                id: "deck_update_add_cards_to_lesson_modal/apply",
              },
              { length: props.number_of_selected_cards },
            )}
          </button>
        </footer>
      </div>

      <form method="dialog" className="modal-backdrop" onClick={handle_cancel}>
        <button>close</button>
      </form>
    </dialog>
  )
}

export const DeckUpdateAddCardsToLessonModal = connector(Wrapper)

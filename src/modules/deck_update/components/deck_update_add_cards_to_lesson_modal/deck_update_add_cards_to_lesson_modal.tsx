import { useIntl } from "react-intl"
import { useState } from "react"
import { FolderIcon, PlusIcon } from "lucide-react"
import {
  connector,
  type ContainerProps,
} from "./deck_update_add_cards_to_lesson_modal.container"
import { cn } from "@/lib/utils"
import { GlobalModal } from "@/modules/global/components/global_modal/global_modal"

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
    <GlobalModal
      title={formatMessage(
        {
          id: "deck_update_add_cards_to_lesson_modal/title",
        },
        { length: props.number_of_selected_cards },
      )}
      description={formatMessage({
        id: "deck_update_add_cards_to_lesson_modal/description",
      })}
      icon={FolderIcon}
      is_open={props.is_open}
      on_close={handle_cancel}
      actions={
        <>
          <button className="btn btn-lg btn-primary" onClick={handle_apply}>
            {formatMessage(
              {
                id: "deck_update_add_cards_to_lesson_modal/apply",
              },
              { length: props.number_of_selected_cards },
            )}
          </button>
        </>
      }
    >
      <div className="rounded-box border-base-300 w-full border">
        {props.lessons.map((lesson) => (
          <label
            key={lesson.id}
            className={cn("flex w-full cursor-pointer items-center gap-2 p-4")}
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
    </GlobalModal>
  )
}

export const DeckUpdateAddCardsToLessonModal = connector(Wrapper)

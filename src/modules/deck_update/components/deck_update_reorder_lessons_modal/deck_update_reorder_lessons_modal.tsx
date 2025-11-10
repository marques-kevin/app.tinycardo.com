import { useIntl } from "react-intl"
import { useState, useEffect } from "react"
import { ArrowUpNarrowWideIcon } from "lucide-react"
import {
  connector,
  type ContainerProps,
} from "./deck_update_reorder_lessons_modal.container"
import { GlobalModal } from "@/modules/global/components/global_modal/global_modal"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"

export function Wrapper(props: ContainerProps) {
  const [ordered_lessons, set_ordered_lessons] = useState<
    Array<{ id: string; name: string; position: number }>
  >([])
  const { formatMessage } = useIntl()

  useEffect(() => {
    if (props.is_open) {
      const sorted_lessons = [...props.lessons].sort(
        (a, b) => a.position - b.position,
      )
      set_ordered_lessons(
        sorted_lessons.map((lesson) => ({
          id: lesson.id,
          name: lesson.name,
          position: lesson.position,
        })),
      )
    }
  }, [props.is_open, props.lessons])

  const handle_cancel = () => {
    props.on_close_modal()
  }

  const handle_save = () => {
    props.on_reorder_lessons(
      ordered_lessons.map((lesson, index) => ({
        lesson_id: lesson.id,
        position: index,
      })),
    )
  }

  const move_up = (index: number) => {
    if (index === 0) return
    const new_ordered = [...ordered_lessons]
    ;[new_ordered[index - 1], new_ordered[index]] = [
      new_ordered[index],
      new_ordered[index - 1],
    ]
    set_ordered_lessons(new_ordered)
  }

  const move_down = (index: number) => {
    if (index === ordered_lessons.length - 1) return
    const new_ordered = [...ordered_lessons]
    ;[new_ordered[index], new_ordered[index + 1]] = [
      new_ordered[index + 1],
      new_ordered[index],
    ]
    set_ordered_lessons(new_ordered)
  }

  return (
    <GlobalModal
      title={formatMessage({
        id: "deck_update_reorder_lessons_modal/title",
      })}
      description={formatMessage({
        id: "deck_update_reorder_lessons_modal/description",
      })}
      icon={ArrowUpNarrowWideIcon}
      is_open={props.is_open}
      on_close={handle_cancel}
      actions={
        <>
          <button className="btn btn-lg btn-primary" onClick={handle_save}>
            {formatMessage({ id: "deck_update_reorder_lessons_modal/save" })}
          </button>
        </>
      }
    >
      <div className="w-full space-y-2">
        {ordered_lessons.length === 0 ? (
          <p className="text-base-content/60 text-center">
            {formatMessage({
              id: "deck_update_reorder_lessons_modal/no_lessons",
            })}
          </p>
        ) : (
          ordered_lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="border-base-300 bg-base-100 flex items-center justify-between gap-2 rounded-lg border p-3"
            >
              <span className="flex-1 font-medium">{lesson.name}</span>
              <div className="flex gap-1">
                <button
                  className="btn btn-ghost btn-sm btn-circle"
                  onClick={() => move_up(index)}
                  disabled={index === 0}
                  title={formatMessage({
                    id: "deck_update_reorder_lessons_modal/move_up",
                  })}
                >
                  <ArrowUpIcon className="size-4" />
                </button>
                <button
                  className="btn btn-ghost btn-sm btn-circle"
                  onClick={() => move_down(index)}
                  disabled={index === ordered_lessons.length - 1}
                  title={formatMessage({
                    id: "deck_update_reorder_lessons_modal/move_down",
                  })}
                >
                  <ArrowDownIcon className="size-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </GlobalModal>
  )
}

export const DeckUpdateReorderLessonsModal = connector(Wrapper)

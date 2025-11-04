import { useIntl } from "react-intl"
import { cn } from "@/lib/utils"
import {
  EllipsisVerticalIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/lib/shadcn/dropdown-menu"
import { connector, type ContainerProps } from "./deck_update_tabs.container"

function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()

  return (
    <div className="pb-2">
      <div
        role="tablist"
        className="tabs tabs-lg tabs-box flex w-full items-center"
      >
        <a
          role="tab"
          className={cn("tab", props.active_lesson_id === null && "tab-active")}
          onClick={() => props.on_set_active_lesson(null)}
        >
          {formatMessage({ id: "deck_update_tabs/all_cards" })}
        </a>

        {props.lessons.map((lesson) => (
          <a
            key={lesson.id}
            role="tab"
            className={cn(
              "tab pr-1",
              props.active_lesson_id === lesson.id && "tab-active",
            )}
            onClick={() => props.on_set_active_lesson(lesson.id)}
          >
            <span>{lesson.name}</span>
            {props.active_lesson_id === lesson.id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button tabIndex={0} className="btn btn-ghost btn-circle">
                    <EllipsisVerticalIcon className="size-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="mt-1">
                  <DropdownMenuItem
                    onClick={() => {
                      props.on_open_rename_modal(lesson.id)
                    }}
                  >
                    <PencilIcon className="size-4" />
                    <span>
                      {formatMessage({ id: "deck_update_tabs/rename" })}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-error"
                    onClick={() => props.on_delete_lesson(lesson.id)}
                  >
                    <TrashIcon className="size-4" />
                    <span>
                      {formatMessage({ id: "deck_update_tabs/delete" })}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </a>
        ))}

        <button className="btn btn-ghost" onClick={props.on_create_lesson}>
          <PlusIcon className="size-5" />
        </button>
      </div>
    </div>
  )
}

export const DeckUpdateTabs = connector(Wrapper)

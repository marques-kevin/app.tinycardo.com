import { cn } from "@/lib/utils"
import { EllipsisVerticalIcon, PlusIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/lib/shadcn/dropdown-menu"
import { connector, type ContainerProps } from "./deck_update_tabs.container"

function Wrapper(props: ContainerProps) {
  return (
    <div className="pb-2">
      <div
        role="tablist"
        className="tabs tabs-lg tabs-box flex w-full items-center"
      >
        <a role="tab" className={cn("tab")}>
          Toutes les cartes
        </a>

        {props.lessons.map((lesson) => (
          <a key={lesson.id} role="tab" className={cn("tab tab-active pr-1")}>
            <span>{lesson.name}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button tabIndex={0} className="btn btn-ghost btn-circle">
                  <EllipsisVerticalIcon className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mt-1">
                <DropdownMenuItem
                  onClick={() => props.on_open_rename_modal(lesson.id)}
                >
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </span>
                  Renommer
                </DropdownMenuItem>
                <DropdownMenuItem className="text-error">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22m-5 0V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
                      />
                    </svg>
                  </span>
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

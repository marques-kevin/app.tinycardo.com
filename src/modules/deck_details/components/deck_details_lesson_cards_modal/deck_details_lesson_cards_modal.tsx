import { useIntl } from "react-intl"
import { BookOpenIcon } from "lucide-react"
import { GlobalModal } from "@/modules/global/components/global_modal/global_modal"
import { cn } from "@/lib/utils"
import { emoji_flags } from "@/modules/decks/utils/emoji_flags"
import {
  connector,
  type ContainerProps,
} from "./deck_details_lesson_cards_modal.container"

function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()

  const lesson_name =
    props.lesson_name === "__other__"
      ? formatMessage({
          id: "deck_details_lessons_list/other_lesson",
        })
      : props.lesson_name || ""

  return (
    <GlobalModal
      title={lesson_name}
      icon={BookOpenIcon}
      is_open={props.is_open}
      on_close={props.on_close}
    >
      <div className="rounded-box border-base-content/10 bg-base-100 max-h-[60vh] overflow-auto">
        {props.cards.length === 0 ? (
          <div className="p-8 text-center text-base-content/60">
            {formatMessage({
              id: "deck_details_lesson_cards_modal/no_cards",
            })}
          </div>
        ) : (
          <>
            <div className="text-base-content divide-base-content/10 border-base-content/10 grid grid-cols-2 gap-2 divide-x border-b text-xl sticky top-0 bg-base-100 z-10">
              <div className="p-4">{emoji_flags[props.front_language]}</div>
              <div className="p-4">{emoji_flags[props.back_language]}</div>
            </div>

            <div className="divide-base-content/10 border-base-content/10 divide-y">
              {props.cards.map((card, index) => (
                <div
                  key={card.id}
                  className={cn(
                    "divide-base-content/10 grid grid-cols-2 gap-2 divide-x text-lg",
                    index % 2 === 0 ? "bg-base-100" : "bg-base-200",
                  )}
                >
                  <div className="p-4">{card.front}</div>
                  <div className="p-4">{card.back}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </GlobalModal>
  )
}

export const DeckDetailsLessonCardsModal = connector(Wrapper)


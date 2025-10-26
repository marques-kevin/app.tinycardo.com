import { dayjs } from "@/lib/date"
import type { ReactNode } from "react"
import {
  connector,
  type ContainerProps,
} from "@/modules/sessions/components/session_reviewed_words_table/session_reviewed_words_table.container"
import type { SessionHistoryWithCardEntity } from "@/modules/sessions/entities/session_history_entity"
import {
  GalleryHorizontalEndIcon,
  CheckCircleIcon,
  FlameIcon,
  XIcon,
} from "lucide-react"
import { useIntl } from "react-intl"

function EmptyPlaceholder(props: { children: ReactNode }) {
  return (
    <div className="bg-base-200 border-base-300 text-base-content w-full rounded-md border px-4 py-8 text-center font-medium">
      <GalleryHorizontalEndIcon className="mx-auto mb-2 inline-block size-6" />

      <div>{props.children}</div>
    </div>
  )
}

function WordsReviewedTableItem(props: {
  word: SessionHistoryWithCardEntity
  streak: number
  show_next_due: boolean
  show_streak: boolean
}) {
  const { formatMessage } = useIntl()

  return (
    <li className="list-row px-0">
      <div className="list-col-grow w-full justify-between lg:flex">
        <div>
          <div className="text-lg">{props.word.front}</div>
          <div className="text-base-content/80">{props.word.back}</div>
        </div>

        <div className="mt-4 text-right lg:mt-0">
          {props.show_next_due && (
            <div className="tooltip tooltip-left text-base-content">
              {dayjs(props.word.next_due_at).fromNow()}

              <div className="tooltip-content">
                {formatMessage(
                  {
                    id: "session_reviewed_words_table/next_due_tooltip",
                  },
                  {
                    date: dayjs(props.word.next_due_at).format(
                      "DD MMMM YYYY HH:mm",
                    ),
                  },
                )}
              </div>
            </div>
          )}

          {props.show_streak && props.streak > 0 && (
            <div>
              <div className="badge badge-sm badge-ghost tooltip tooltip-left">
                <FlameIcon className="size-3 fill-current" /> {props.streak}
                <div className="tooltip-content">
                  {formatMessage(
                    {
                      id: "session_reviewed_words_table/streak_tooltip",
                    },
                    { count: props.streak },
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </li>
  )
}

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="card border-base-300 border">
        <div className="card-body">
          <h3 className="card-title">
            <XIcon className="text-error size-4 flex-shrink-0" />
            {formatMessage({
              id: "session_reviewed_words_table/cards_to_review_title",
            })}
          </h3>

          <ul className="list">
            {props.unknown_words.map((word) => (
              <WordsReviewedTableItem
                key={word.card_id}
                word={word}
                streak={word.repetition_count}
                show_next_due={false}
                show_streak={false}
              />
            ))}
          </ul>

          {props.unknown_words.length === 0 && (
            <EmptyPlaceholder>
              {formatMessage({
                id: "session_reviewed_words_table/cards_to_review_empty",
              })}
            </EmptyPlaceholder>
          )}
        </div>
      </div>

      <div className="card border-base-300 border">
        <div className="card-body">
          <h3 className="card-title">
            <CheckCircleIcon className="text-success size-4 flex-shrink-0" />
            {formatMessage({
              id: "session_reviewed_words_table/mastered_cards_title",
            })}
          </h3>

          <ul className="list">
            {props.known_words.map((word) => (
              <WordsReviewedTableItem
                key={word.card_id}
                word={word}
                streak={word.repetition_count}
                show_next_due={true}
                show_streak={true}
              />
            ))}
          </ul>

          {props.known_words.length === 0 && (
            <EmptyPlaceholder>
              {formatMessage({
                id: "session_reviewed_words_table/mastered_cards_empty",
              })}
            </EmptyPlaceholder>
          )}
        </div>
      </div>
    </div>
  )
}

export const SessionReviewedWordsTable = connector(Wrapper)

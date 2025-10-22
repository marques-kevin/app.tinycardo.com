import { dayjs } from "@/lib/date"
import {
  connector,
  type ContainerProps,
} from "@/modules/sessions/components/session_reviewed_words_table/session_reviewed_words_table.container"
import type { SessionHistoryWithCardEntity } from "@/modules/sessions/entities/session_history_entity"
import { CheckCircleIcon, FlameIcon, XIcon } from "lucide-react"
import { useIntl } from "react-intl"

function WordsReviewedTableItem(props: {
  word: SessionHistoryWithCardEntity
  streak: number
}) {
  const { formatMessage } = useIntl()
  return (
    <li className="list-row px-0">
      <div className="list-col-grow">
        <div className="text-lg">{props.word.front}</div>
        <div className="text-base-content/80 text-sm">{props.word.back}</div>
      </div>
      <div className="text-right">
        <div className="tooltip tooltip-left text-base-content">
          {dayjs(props.word.next_due_at).fromNow()}

          <div className="tooltip-content">
            {formatMessage(
              {
                id: "session_ended_splash_screen/words_reviewed_table_item/next_due_tooltip",
              },
              {
                date: dayjs(props.word.next_due_at).format(
                  "DD MMMM YYYY HH:mm",
                ),
              },
            )}
          </div>
        </div>

        {props.streak > 0 && (
          <div>
            <div className="badge badge-sm badge-ghost tooltip tooltip-left">
              <FlameIcon className="size-3 fill-current" /> {props.streak}
              <div className="tooltip-content">
                {formatMessage(
                  {
                    id: "session_ended_splash_screen/words_reviewed_table_item/streak_tooltip",
                  },
                  { count: props.streak },
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </li>
  )
}

function WordsReviewedTable(props: { words: SessionHistoryWithCardEntity[] }) {
  return (
    <ul className="list">
      {props.words.map((word) => (
        <WordsReviewedTableItem
          key={word.card_id}
          word={word}
          streak={word.repetition_count}
        />
      ))}
    </ul>
  )
}

function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()

  if (props.known_words.length === 0 && props.unknown_words.length === 0) {
    return null
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="card border-base-300 border">
        <div className="card-body">
          <h3 className="card-title">
            <XIcon className="text-error size-4" />
            {formatMessage({
              id: "session_ended_splash_screen/session_ended_words_reviewed_table/cards_to_review_title",
            })}
          </h3>

          <WordsReviewedTable words={props.unknown_words} />
        </div>
      </div>

      <div className="card border-base-300 border">
        <div className="card-body">
          <h3 className="card-title">
            <CheckCircleIcon className="text-success size-4" />
            {formatMessage({
              id: "session_ended_splash_screen/session_ended_words_reviewed_table/mastered_cards_title",
            })}
          </h3>

          <WordsReviewedTable words={props.known_words} />
        </div>
      </div>
    </div>
  )
}

export const SessionReviewedWordsTable = connector(Wrapper)

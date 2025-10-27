import { SessionReturnBackButton } from "@/modules/sessions/components/session_return_back_button/session_return_back_button"
import { SessionReviewedWordsTable } from "@/modules/sessions/components/session_reviewed_words_table/session_reviewed_words_table"
import { FormattedMessage, useIntl } from "react-intl"
import {
  connector,
  type ContainerProps,
} from "@/modules/sessions/components/session_ended_splash_screen/session_ended_splash_screen.container"

function SessionEndAnnouncement(props: ContainerProps) {
  const { formatMessage } = useIntl()

  return (
    <header className="text-center text-balance">
      <h1 className="text-4xl font-bold">
        {formatMessage({
          id: "session_ended_splash_screen/session_end_announcement/title",
        })}
      </h1>

      <p className="mt-4 text-xl">
        <FormattedMessage
          id="session_ended_splash_screen/session_end_announcement/reviewed_summary"
          values={{
            total: props.known_words.length + props.unknown_words.length,
            known: props.known_words.length,
            unknown: props.unknown_words.length,
            totalKbd: (chunks: React.ReactNode) => (
              <span className="kbd kbd-xl">{chunks}</span>
            ),
            knownKbd: (chunks: React.ReactNode) => (
              <span className="kbd kbd-xl text-success-content bg-success">
                {chunks}
              </span>
            ),
            unknownKbd: (chunks: React.ReactNode) => (
              <span className="kbd kbd-xl text-error-content bg-error">
                {chunks}
              </span>
            ),
          }}
        />
      </p>
    </header>
  )
}

function SessionEndedActions(props: ContainerProps) {
  const { formatMessage } = useIntl()

  if (props.mode === "learn_new_words") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          className="btn btn-lg btn-primary"
          onClick={() =>
            props.start_session({
              mode: "auto",
            })
          }
        >
          {formatMessage({
            id: "session_ended_splash_screen/actions/continue_reviewing",
          })}
        </button>
        <button
          className="btn btn-lg btn-ghost"
          onClick={() =>
            props.start_session({
              mode: "randomized",
            })
          }
        >
          {formatMessage({
            id: "session_ended_splash_screen/actions/random_session",
          })}
        </button>
      </div>
    )
  }

  if (props.mode === "randomized") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          className="btn btn-lg btn-primary"
          onClick={() => props.start_session({ mode: "randomized" })}
        >
          {formatMessage({
            id: "session_ended_splash_screen/actions/random_session",
          })}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <button
        className="btn btn-lg btn-primary"
        onClick={() => props.start_session({ mode: "auto" })}
      >
        {formatMessage({
          id: "session_ended_splash_screen/actions/continue_reviewing",
        })}
      </button>

      <button
        className="btn btn-lg btn-ghost"
        onClick={() => props.start_session({ mode: "randomized" })}
      >
        {formatMessage({
          id: "session_ended_splash_screen/actions/random_session",
        })}
      </button>
    </div>
  )
}

export function Wrapper(props: ContainerProps) {
  return (
    <main className="space-y-12 px-4 py-14">
      <SessionReturnBackButton />
      <SessionEndAnnouncement {...props} />
      <SessionEndedActions {...props} />
      <SessionReviewedWordsTable />
    </main>
  )
}

export const SessionEndedSplashScreen = connector(Wrapper)

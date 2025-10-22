import { SessionReturnBackButton } from "@/modules/sessions/components/session_return_back_button/session_return_back_button"
import { SessionReviewedWordsTable } from "@/modules/sessions/components/session_reviewed_words_table/session_reviewed_words_table"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { FormattedMessage, useIntl } from "react-intl"
import * as actions from "@/modules/sessions/redux/sessions_actions"

function SessionEndAnnouncement() {
  const { formatMessage } = useIntl()
  const { known_words, unknown_words } = useAppSelector(
    (state) => state.sessions,
  )

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
            total: known_words.length + unknown_words.length,
            known: known_words.length,
            unknown: unknown_words.length,
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

function SessionEndedActions() {
  const { formatMessage } = useIntl()
  const dispatch = useAppDispatch()
  const mode = useAppSelector((state) => state.sessions.mode)

  if (mode === "learn_new_words") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          className="btn btn-lg btn-primary"
          onClick={() =>
            dispatch(
              actions.start_session({
                mode: "review",
              }),
            )
          }
        >
          {formatMessage({
            id: "session_ended_splash_screen/session_ended_actions/back_to_reviewing",
          })}
        </button>
        <button
          className="btn btn-lg btn-ghost"
          onClick={() =>
            dispatch(
              actions.start_session({
                mode: "learn_new_words",
              }),
            )
          }
        >
          {formatMessage({
            id: "session_ended_splash_screen/session_ended_actions/learn_again_new_words",
          })}
        </button>
      </div>
    )
  }

  if (mode === "randomized") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button className="btn btn-lg btn-primary" onClick={() => {}}>
          {formatMessage({
            id: "session_ended_splash_screen/session_ended_actions/continue_reviewing",
          })}
        </button>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-4">
      <button
        className="btn btn-lg btn-primary"
        onClick={() => {
          dispatch(
            actions.start_session({
              mode: "review",
            }),
          )
        }}
      >
        {formatMessage({
          id: "session_ended_splash_screen/session_ended_actions/continue_reviewing",
        })}
      </button>
      <button
        className="btn btn-lg btn-ghost"
        onClick={() =>
          dispatch(
            actions.start_session({
              mode: "learn_new_words",
            }),
          )
        }
      >
        {formatMessage({
          id: "session_ended_splash_screen/session_ended_actions/learn_new_words",
        })}
      </button>
    </div>
  )
}

export function SessionEndedSplashScreen() {
  return (
    <main className="space-y-12 px-4 py-14">
      <SessionReturnBackButton />
      <SessionEndAnnouncement />
      <SessionEndedActions />
      <SessionReviewedWordsTable />
    </main>
  )
}

import { SessionReturnBackButton } from "@/modules/sessions/components/session_return_back_button/session_return_back_button"
import { useIntl } from "react-intl"
import {
  connector,
  type ContainerProps,
} from "./session_no_more_review.container"
import { LightbulbIcon } from "lucide-react"

function Head(props: { title: string; description: string }) {
  return (
    <header className="mx-auto max-w-prose space-y-4 text-center text-balance">
      <LightbulbIcon className="inline-block size-8" />

      <h1 className="text-4xl font-bold">{props.title}</h1>

      <p className="text-base-content/80 text-lg">{props.description}</p>
    </header>
  )
}

function Header(props: ContainerProps) {
  const { formatMessage } = useIntl()

  if (props.state === "reviewed_and_learned_all_cards") {
    return (
      <Head
        title={formatMessage({
          id: "session_no_more_review/reviewed_and_learned_all_cards/head/title",
        })}
        description={formatMessage({
          id: "session_no_more_review/reviewed_and_learned_all_cards/head/description",
        })}
      />
    )
  }

  if (props.state === "learned_all_cards") {
    return (
      <Head
        title={formatMessage({
          id: "session_no_more_review/learned_all_cards/head/title",
        })}
        description={formatMessage({
          id: "session_no_more_review/learned_all_cards/head/description",
        })}
      />
    )
  }

  if (props.state === "reviewed_all_cards") {
    return (
      <Head
        title={formatMessage({
          id: "session_no_more_review/reviewed_all_cards/head/title",
        })}
        description={formatMessage({
          id: "session_no_more_review/reviewed_all_cards/head/description",
        })}
      />
    )
  }

  return null
}

function Actions(props: ContainerProps) {
  const { formatMessage } = useIntl()

  if (props.state === "reviewed_and_learned_all_cards") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          className="btn btn-lg btn-primary"
          onClick={() => props.start_session({ mode: "randomized" })}
        >
          {formatMessage({
            id: "session_no_more_review/reviewed_and_learned_all_cards/actions/random_session",
          })}
        </button>
      </div>
    )
  }

  if (props.state === "learned_all_cards") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          className="btn btn-lg btn-primary"
          onClick={() => props.start_session({ mode: "review" })}
        >
          {formatMessage({
            id: "session_no_more_review/learned_all_cards/actions/review_due_cards",
          })}
        </button>
        <button
          className="btn btn-lg btn-ghost"
          onClick={() => props.start_session({ mode: "randomized" })}
        >
          {formatMessage({
            id: "session_no_more_review/learned_all_cards/actions/random_session",
          })}
        </button>
      </div>
    )
  }

  if (props.state === "reviewed_all_cards") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          className="btn btn-lg btn-primary"
          onClick={() => props.start_session({ mode: "learn_new_words" })}
        >
          {formatMessage({
            id: "session_no_more_review/reviewed_all_cards/actions/learn_new_cards",
          })}
        </button>
        <button
          className="btn btn-lg btn-ghost"
          onClick={() => props.start_session({ mode: "randomized" })}
        >
          {formatMessage({
            id: "session_no_more_review/reviewed_all_cards/actions/random_session",
          })}
        </button>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-4">
      <button className="btn btn-lg btn-primary" onClick={() => {}}>
        {formatMessage({
          id: "session_ended_splash_screen/session_ended_actions/continue_reviewing",
        })}
      </button>
      <button className="btn btn-lg btn-ghost" onClick={() => {}}>
        {formatMessage({
          id: "session_ended_splash_screen/session_ended_actions/learn_new_words",
        })}
      </button>
    </div>
  )
}

export function Wrapper(props: ContainerProps) {
  return (
    <main className="space-y-12 px-4 py-14">
      <SessionReturnBackButton />
      <Header {...props} />
      <Actions {...props} />
    </main>
  )
}

export const SessionNoMoreReview = connector(Wrapper)

import { SessionFooterHelp } from "@/modules/sessions/components/session_footer_help/session_footer_help"
import { SessionsCards } from "@/modules/sessions/components/session_cards/sessions_cards"
import { SessionEndedSplashScreen } from "@/modules/sessions/components/session_ended_splash_screen/session_ended_splash_screen"
import { SessionProgressBar } from "@/modules/sessions/components/session_progress_bar/session_progress_bar"
import { SessionReturnBackButton } from "@/modules/sessions/components/session_return_back_button/session_return_back_button"
import { SessionReviewedWordsTable } from "@/modules/sessions/components/session_reviewed_words_table/session_reviewed_words_table"
import { useAppSelector } from "@/redux/store"
import { SessionMobileControls } from "@/modules/sessions/components/session_mobile_controls/session_mobile_controls"
import { SessionHelpDialog } from "@/modules/sessions/components/session_help_dialog/session_help_dialog"

export function SessionPage() {
  const { is_ended, is_loading } = useAppSelector((state) => state.sessions)

  if (is_loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    )
  }

  if (is_ended) {
    return <SessionEndedSplashScreen />
  }

  return (
    <div className="space-y-14 px-4 py-14">
      <div className="mx-auto max-w-2xl space-y-4">
        <SessionReturnBackButton />
        <SessionProgressBar />

        <div className="mx-auto w-full max-w-2xl">
          <SessionsCards />

          <div className="mt-8 space-y-8 text-center">
            <SessionMobileControls />
            <SessionFooterHelp />
          </div>
        </div>
      </div>
      <SessionReviewedWordsTable />
      <SessionHelpDialog />
    </div>
  )
}

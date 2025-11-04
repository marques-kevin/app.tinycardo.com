import { SessionFooterHelp } from "@/modules/sessions/components/session_footer_help/session_footer_help"
import { SessionsCards } from "@/modules/sessions/components/session_cards/sessions_cards"
import { SessionProgressBar } from "@/modules/sessions/components/session_progress_bar/session_progress_bar"
import { SessionReturnBackButton } from "@/modules/sessions/components/session_return_back_button/session_return_back_button"
import { SessionReviewedWordsTable } from "@/modules/sessions/components/session_reviewed_words_table/session_reviewed_words_table"
import { SessionMobileControls } from "@/modules/sessions/components/session_mobile_controls/session_mobile_controls"
import { SessionHelpDialog } from "@/modules/sessions/components/session_help_dialog/session_help_dialog"
import { SessionConditionalView } from "../components/session_conditional_view/session_conditional_view"

export function SessionPage() {
  return (
    <SessionConditionalView>
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
    </SessionConditionalView>
  )
}

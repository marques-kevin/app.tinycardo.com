import { ParamsSelectLanguage } from "@/modules/params/components/params_select_language/params_select_language"
import { ParamsSelectTheme } from "@/modules/params/components/params_select_theme/params_select_theme"
import { GlobalNavbar } from "@/modules/global/components/global_navbar/global_navbar"
import { ParamsSelectSessionBehavior } from "@/modules/params/components/params_session_behavior/params_session_behavior"
import { ParamsDangerZone } from "@/modules/params/components/params_danger_zone/params_danger_zone"
import { ParamsAccountSection } from "@/modules/params/components/params_account_section/params_account_section"
import { GlobalLayout } from "@/modules/global/components/global_layout/global_layout"
import { GlobalFooter } from "@/modules/global/components/global_footer/global_footer"

export function ParamsPage() {
  return (
    <GlobalLayout>
      <GlobalNavbar />

      <div className="flex flex-col gap-6">
        <ParamsSelectLanguage />
        <ParamsSelectSessionBehavior />
        <ParamsSelectTheme />
        <ParamsAccountSection />
        <ParamsDangerZone />
      </div>

      <GlobalFooter />
    </GlobalLayout>
  )
}

import React from "react"
import { StreakCalendar } from "../streak_calendar/streak_calendar"
import { connector } from "./streak_modal.container"
import type { ContainerProps } from "./streak_modal.container"
import { useIntl } from "react-intl"
import { StreakIcon } from "@/modules/streak/components/streak_icon/streak_icon"

export const Wrapper: React.FC<ContainerProps> = (props) => {
  const { formatMessage } = useIntl()

  return (
    <dialog
      className={`modal`}
      open={props.is_open}
      onClose={props.on_close_streak_modal}
    >
      <div className="modal-box max-w-md p-0">
        <div className="bg-accent text-accent-content rounded-t-xl bg-gradient-to-br">
          <div className="rounded-t-xl pt-5 pb-6">
            <div className="relative flex items-center justify-center px-6">
              <div className="absolute left-0 ml-4">
                <button
                  type="button"
                  onClick={props.on_close_streak_modal}
                  className="btn btn-ghost btn-circle"
                >
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="text-lg font-semibold">
                {formatMessage({ id: "streak_modal/title" })}
              </div>
            </div>
          </div>

          <div className="px-8 pt-4 pb-8">
            <div className="flex items-center justify-between">
              <div className="text-3xl font-semibold">
                {formatMessage(
                  {
                    id: "streak_modal/current-streak",
                  },
                  { streak: props.current_streak },
                )}
              </div>

              <StreakIcon className="w-16" />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <StreakCalendar />
        </div>
      </div>
      <div
        className="modal-backdrop"
        onClick={props.on_close_streak_modal}
      ></div>
    </dialog>
  )
}

export const StreakModal = connector(Wrapper)

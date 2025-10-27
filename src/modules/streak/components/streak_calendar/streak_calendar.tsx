import React from "react"
import { ChevronRightIcon, ChevronLeftIcon } from "lucide-react"
import { connector, type ContainerProps } from "./streak_calendar.containers"
import dayjs from "dayjs"
import clsx from "clsx"
import { useIntl } from "react-intl"
import { StreakIcon } from "@/modules/streak/components/streak_icon/streak_icon"
import { cn } from "@/lib/utils"

export const Wrapper: React.FC<ContainerProps> = (props) => {
  const { locale } = useIntl()

  return (
    <div className="relative mx-auto pb-4">
      <div className="w-full px-4">
        <section className="mx-auto w-full text-center">
          <div className="flex items-center justify-between">
            <button
              onClick={() => props.on_previous_month()}
              className="btn btn-ghost btn-circle"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <div className="font-semibold capitalize">
              {props.currentMonth.toLocaleDateString(locale, {
                month: "long",
              })}
            </div>
            <button
              onClick={() => props.on_next_month()}
              className="btn btn-ghost btn-circle"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="font-display mt-6 grid grid-cols-7 text-xs leading-6">
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
            <div>S</div>
          </div>
          <div className="bg-base-200 ring-base-200 isolate mt-2 grid grid-cols-7 gap-px rounded-lg text-sm ring-1">
            {props.calendar.map(({ date, isCurrentMonth }, index) => {
              const does_today_have_streak = props.streaks.find((streak) =>
                dayjs(streak.date).isSame(date, "day"),
              )

              return (
                <button
                  key={date.toString()}
                  type="button"
                  className={cn(
                    isCurrentMonth
                      ? "bg-base-100 hover:bg-base-200 focus:z-10"
                      : "bg-base-200 cursor-not-allowed",
                    index === 0 && "rounded-tl-lg",
                    index === 6 && "rounded-tr-lg",
                    index === props.calendar.length - 7 && "rounded-bl-lg",
                    index === props.calendar.length - 1 && "rounded-br-lg",
                    "relative py-1.5",
                  )}
                >
                  {does_today_have_streak && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <StreakIcon className="w-7" />
                    </div>
                  )}

                  <time
                    dateTime={date.toString()}
                    className={clsx(
                      "relative mx-auto flex h-10 w-10 items-center justify-center rounded-full",
                      does_today_have_streak && "opacity-0",
                    )}
                  >
                    {date.toLocaleDateString(locale, { day: "numeric" })}
                  </time>
                </button>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}

export const StreakCalendar = connector(Wrapper)

import Dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

Dayjs.extend(relativeTime)

export const dayjs = Dayjs

export function getDaysInMonth(params: {
  month: number
  year: number
}): Date[] {
  const date = new Date(params.year, params.month, 1)
  const days = []

  while (date.getMonth() === params.month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }

  return days
}

export function getCalendar(params: { month: number; year: number }): Array<{
  date: Date
  isCurrentMonth?: boolean
  isSelected?: boolean
}> {
  const thisMonth = getDaysInMonth(params)
  const lastMonth = getDaysInMonth({
    year: params.month === 0 ? params.year - 1 : params.year,
    month: params.month === 0 ? 11 : params.month - 1,
  })
  const nextMonth = getDaysInMonth({
    year: params.month === 11 ? params.year + 1 : params.year,
    month: params.month === 11 ? 0 : params.month + 1,
  })

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const firstDayName = thisMonth[0].toLocaleDateString("en", {
    weekday: "short",
  })
  const lastDayName = thisMonth[thisMonth.length - 1].toLocaleDateString("en", {
    weekday: "short",
  })

  return [
    ...lastMonth
      .slice(
        lastMonth.length -
          (7 - (7 - DAYS.findIndex((day) => firstDayName === day))),
      )
      .map((date) => ({ date })),
    ...thisMonth.map((date) => ({ date, isCurrentMonth: true })),
    ...nextMonth
      .slice(
        0,
        7 - (7 - DAYS.reverse().findIndex((day) => lastDayName === day)),
      )
      .map((date) => ({ date })),
  ]
}

export const createDailyInterval = (days: number, from: Date | string) => {
  const dates = Array.from({ length: days })
    .map((value, index) => {
      const date = dayjs(new Date(from)).subtract(index, "days")
      return date.format("YYYY-MM-DD")
    })
    .reverse()

  return dates
}

export const getAllDaysOfMonth = (date: Date) => {
  const month = date.getMonth()
  const dates: Date[] = []

  while (date.getMonth() === month) {
    dates.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }

  return dates
}

export const createYearInterval = (from: Date | string) => {
  const dates = Array.from({ length: 12 })
    .map((value, index) => {
      const date = dayjs(new Date(from)).subtract(index, "months")
      return date.format("YYYY-MM")
    })
    .reverse()

  return dates
}

export const createDailyIntervalWithDayNumberAndName = (days: number) => {
  const dates = Array.from({ length: days })
    .map((value, index) => {
      const date = dayjs().subtract(index, "days")
      return { number: date.format("D"), day: date.format("ddd") }
    })
    .reverse()

  return dates
}

export const secondsToHuman = (seconds: number) => {
  if (seconds < 60) return [0, 0, seconds]
  if (seconds < 3600) return [0, Math.floor(seconds / 60), seconds % 60]

  return [
    Math.floor(seconds / 3600),
    Math.floor((seconds % 3600) / 60),
    seconds % 60,
  ]
}

export const secondsToHumanString = (seconds: number) => {
  const [h, m, s] = secondsToHuman(seconds)

  return `${h ? `${h}h ` : ""}${m ? `${m}m ` : ""}${s}s`
}

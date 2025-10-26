export function big_number_formatter(params: {
  value: number | string
  digits: number
  locale?: string
}): string {
  const number_to_format = Number(params.value)

  if (number_to_format === 0) {
    return "0"
  }

  const locale = params.locale || "en-US"

  const si = [
    { value: 1e18, symbol: "E" },
    { value: 1e15, symbol: "P" },
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "G" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "k" },
  ]

  for (let i = 0; i < si.length; i++) {
    if (number_to_format >= si[i].value) {
      return (
        (number_to_format / si[i].value).toLocaleString(locale, {
          maximumFractionDigits: params.digits,
        }) + si[i].symbol
      )
    }
  }

  return number_to_format?.toLocaleString(locale, {
    maximumFractionDigits: params.digits,
  })
}

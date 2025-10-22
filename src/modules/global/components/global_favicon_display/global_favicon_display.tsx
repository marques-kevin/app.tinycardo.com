import { useEffect } from "react"

export function GlobalFaviconDisplay() {
  useEffect(() => {
    const favicon = document.getElementById(
      "dynamic-favicon",
    ) as HTMLLinkElement

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill="${getComputedStyle(
        document.documentElement,
      )
        .getPropertyValue("--logo-color")
        .trim()}" />
    </svg>`

    const blob = new Blob([svg], { type: "image/svg+xml" })

    favicon.href = URL.createObjectURL(blob)
  }, [])

  return <></>
}

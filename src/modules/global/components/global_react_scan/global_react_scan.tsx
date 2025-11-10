import { useEffect } from "react"

export function GlobalReactScan() {
  useEffect(() => {
    if (import.meta.env.MODE === "development") {
      const script = document.createElement("script")
      script.src = "https://unpkg.com/react-scan/dist/auto.global.js"
      script.async = true
      document.head.appendChild(script)
      return () => {
        document.head.removeChild(script)
      }
    }
  }, [])

  return null
}

import { useRef } from "react"
import { useAppDispatch } from "@/redux/store"
import * as actions from "@/modules/decks/redux/decks_actions"
import { DownloadIcon } from "lucide-react"

export function CsvImportButton() {
  const dispatch = useAppDispatch()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      if (content) {
        dispatch(actions.import_cards_from_csv({ content }))
      }
    }
    reader.readAsText(file)

    // Reset the input value so the same file can be selected again
    event.target.value = ""
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <button
        className="btn text-base-content btn-ghost tooltip tooltip-left"
        data-tip="Import from csv file"
        onClick={handleClick}
      >
        <DownloadIcon className="size-4" />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  )
}

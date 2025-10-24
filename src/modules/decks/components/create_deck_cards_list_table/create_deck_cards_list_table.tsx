import {
  connector,
  type ContainerProps,
} from "@/modules/decks/components/create_deck_cards_list_table/create_deck_cards_list_table.container"
import { PlusIcon } from "lucide-react"
import { emoji_flags } from "@/modules/decks/utils/emoji_flags"
import { CreateDeckCardsListItem } from "@/modules/decks/components/create_deck_cards_list_item/create_deck_cards_list_item"
import { CsvImportButton } from "@/modules/decks/components/csv_import_button/csv_import_button"

export function Wrapper(props: ContainerProps) {
  return (
    <div className="w-full">
      <div className="flex gap-2">
        <div className="w-1/2">
          <select
            className="select text-base-content w-full"
            value={props.front_language}
            onChange={(e) => props.on_update_front_language(e.target.value)}
          >
            <option value="en">{emoji_flags.en} English</option>
            <option value="es">{emoji_flags.es} Spanish</option>
            <option value="fr">{emoji_flags.fr} French</option>
            <option value="de">{emoji_flags.de} German</option>
            <option value="it">{emoji_flags.it} Italian</option>
            <option value="pt">{emoji_flags.pt} Portuguese</option>
            <option value="ru">{emoji_flags.ru} Russian</option>
            <option value="ja">{emoji_flags.ja} Japanese</option>
            <option value="ko">{emoji_flags.ko} Korean</option>
            <option value="zh">{emoji_flags.zh} Chinese</option>
          </select>
        </div>
        <div className="w-1/2">
          <select
            className="select text-base-content w-full"
            value={props.back_language}
            onChange={(e) => props.on_update_back_language(e.target.value)}
          >
            <option value="en">{emoji_flags.en} English</option>
            <option value="es">{emoji_flags.es} Spanish</option>
            <option value="fr">{emoji_flags.fr} French</option>
            <option value="de">{emoji_flags.de} German</option>
            <option value="it">{emoji_flags.it} Italian</option>
            <option value="pt">{emoji_flags.pt} Portuguese</option>
            <option value="ru">{emoji_flags.ru} Russian</option>
            <option value="ja">{emoji_flags.ja} Japanese</option>
            <option value="ko">{emoji_flags.ko} Korean</option>
            <option value="zh">{emoji_flags.zh} Chinese</option>
          </select>
        </div>
        <div className="flex-shrink-0">
          <CsvImportButton />
        </div>
      </div>

      <div className="mt-2 space-y-2">
        {props.cards.map((card) => (
          <CreateDeckCardsListItem key={card} card_id={card} />
        ))}
      </div>

      <div className="relative mt-4 flex items-center justify-center">
        <div className="border-primary absolute inset-0 my-auto h-1 border-t"></div>

        <button
          onClick={() => props.on_add()}
          className="btn btn-primary btn-sm relative z-10"
        >
          <PlusIcon className="size-4" />
        </button>
      </div>
    </div>
  )
}

export const CreateDeckCardsListTable = connector(Wrapper)

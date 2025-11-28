import {
  connector,
  type ContainerProps,
} from "./decks_update_cards_list_table.container"
import { emoji_flags } from "@/modules/decks/utils/emoji_flags"
import { DecksUpdateCardsListTableItem } from "@/modules/deck_update/components/decks_update_cards_list_table_item/decks_update_cards_list_table_item"
import { ArrowRightLeft } from "lucide-react"

export function Wrapper(props: ContainerProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0">
          <input
            type="checkbox"
            className="radio"
            checked={props.is_selected}
            onChange={() => props.on_toggle_select_all_cards()}
          />
        </div>
        <div className="w-1/2">
          <select
            className="select select-lg text-base-content w-full"
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
        <button
          className="btn btn-ghost btn-circle"
          onClick={props.on_swap_languages}
        >
          <ArrowRightLeft className="size-4" />
        </button>
        <div className="w-1/2">
          <select
            className="select select-lg text-base-content w-full"
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
      </div>

      <div className="mt-2">
        {props.cards.map((card) => (
          <DecksUpdateCardsListTableItem key={card} card_id={card} />
        ))}
      </div>
    </div>
  )
}

Wrapper.displayName = "DecksUpdateCardsListTable"

export const DecksUpdateCardsListTable = connector(Wrapper)

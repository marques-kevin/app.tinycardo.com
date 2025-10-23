import { emoji_flags } from "@/modules/decks/utils/emoji_flags"
import {
  connector,
  type ContainerProps,
} from "./discover_decks_list_item.container"
import { GalleryHorizontalEndIcon, UsersIcon } from "lucide-react"
import { useIntl } from "react-intl"
import { big_number_formatter } from "@/modules/global/utils/big_number_formatter"

export function Wrapper(props: ContainerProps) {
  const { locale } = useIntl()

  return (
    <div className="bg-base-300 rounded-lg">
      <div
        onClick={() => props.on_click(props.id)}
        className="border-base-300 bg-base-100 flex aspect-square cursor-pointer flex-col rounded-lg border p-4 transition-all duration-300 hover:translate-x-[8px] hover:translate-y-[2px] hover:rotate-[2deg]"
      >
        <header className="flex justify-between">
          <span>{emoji_flags["fr"]}</span>
          <span>{emoji_flags["ko"]}</span>
        </header>

        <div className="flex h-full items-center justify-center text-center text-balance">
          {props.name}
        </div>

        <footer className="mt-auto flex items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-2">
            <GalleryHorizontalEndIcon className="size-4" />
            <span>{props.number_of_cards_in_the_deck}</span>
          </div>

          <div className="flex items-center gap-2">
            <UsersIcon className="size-4" />
            <span>
              {big_number_formatter({
                digits: 0,
                value: props.number_of_users_using_this_deck,
                locale,
              })}
            </span>
          </div>
        </footer>
      </div>
    </div>
  )
}

export const DiscoverDecksListItem = connector(Wrapper)

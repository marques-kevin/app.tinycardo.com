import { Drawer } from "vaul"
import { connector, type ContainerProps } from "./deck_update_drawer.container"
import { CreateDeckCardsListTable } from "../create_deck_cards_list_table/create_deck_cards_list_table"
import { CreateDeckTitle } from "../create_deck_title/create_deck_title"
import { UpdateDeckDescription } from "../update_deck_description/update_deck_description"
import { CreateDeckFooterActions } from "../create_deck_footer_actions/create_deck_footer_actions"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

export function Wrapper(props: ContainerProps) {
  return (
    <Drawer.Root open={props.is_open} onOpenChange={props.on_close}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Drawer.Content className="bg-base-100 text-base-content fixed right-0 bottom-0 left-0 z-50 mt-8 flex h-[100dvh] flex-col">
          <VisuallyHidden>
            <Drawer.Title>Modal</Drawer.Title>
            <Drawer.Description>Modal</Drawer.Description>
          </VisuallyHidden>
          <div className="w-full flex-1 overflow-auto pt-4">
            <div className="container mx-auto px-4">
              <div className="relative">
                <div className="bg-base-content/10 mx-auto mb-8 h-1.5 w-40 flex-shrink-0 rounded-full" />
              </div>

              <div className="grid grid-cols-1 gap-2">
                <CreateDeckTitle />
                <UpdateDeckDescription />
                <CreateDeckCardsListTable />
                <CreateDeckFooterActions />
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export const DeckUpdateDrawer = connector(Wrapper)

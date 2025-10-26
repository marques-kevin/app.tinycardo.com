import { Drawer } from "vaul"
import { DeckDetailsHeader } from "@/modules/deck_details/components/deck_details_header/deck_details_header"
import { DeckDetailsTabs } from "@/modules/deck_details/components/deck_details_tabs/deck_details_tabs"
import { DeckDetailsLessonsList } from "@/modules/deck_details/components/deck_details_lessons_list/deck_details_lessons_list"
import { DeckDetailsCardsList } from "@/modules/deck_details/components/deck_details_cards_list/deck_details_cards_list"
import { connector, type ContainerProps } from "./deck_details_drawer.container"
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

              <div className="space-y-6">
                <DeckDetailsHeader />
                <DeckDetailsTabs>
                  {(tab) => {
                    if (tab === "lessons") {
                      return (
                        <div className="p-4">
                          <DeckDetailsLessonsList
                            lessons={Array.from({ length: 10 }).map(
                              (_, index) => ({
                                id: index.toString(),
                                name: `Lesson ${index + 1}`,
                                total: 10,
                                mastered: 10,
                                review: 10,
                              }),
                            )}
                          />
                        </div>
                      )
                    }

                    return <DeckDetailsCardsList />
                  }}
                </DeckDetailsTabs>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export const DeckDetailsDrawer = connector(Wrapper)

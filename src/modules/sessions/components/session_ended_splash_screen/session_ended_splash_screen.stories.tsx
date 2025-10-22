import { SessionEndedSplashScreen } from "@/modules/sessions/components/session_ended_splash_screen/session_ended_splash_screen"
import { useAppDispatch } from "@/redux/store"
import type { Meta, StoryObj } from "@storybook/react"
import { _update_session } from "@/modules/sessions/redux/sessions_actions"

const meta: Meta<typeof SessionEndedSplashScreen> = {
  title: "Sessions/SessionEndedSplashScreen",
  component: SessionEndedSplashScreen,
}

export default meta
type Story = StoryObj<typeof SessionEndedSplashScreen>

export const Default: Story = {
  render: () => {
    const dispatch = useAppDispatch()

    dispatch(
      _update_session({
        known_words: [
          {
            card_id: "1",
            front: "나는 매일 아침 일찍 일하러 갑니다",
            back: "Je vais travailler tôt tous les matins",
            deck_id: "1",
            repetition_count: 1,
            ease_factor: 1.3,
            next_due_at: new Date(
              Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000,
            ),
            last_reviewed_at: new Date(),
          },
          {
            card_id: "2",
            front: "이 음식은 매우 맛있어 보입니다",
            back: "Cette nourriture a l'air très délicieuse",
            deck_id: "1",
            repetition_count: 1,
            ease_factor: 1.3,
            next_due_at: new Date(
              Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000,
            ),
            last_reviewed_at: new Date(),
          },
          {
            card_id: "6",
            front: "저는 한국어를 공부하고 있습니다",
            back: "J'étudie le coréen",
            deck_id: "1",
            repetition_count: 3,
            ease_factor: 1.5,
            next_due_at: new Date(
              Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000,
            ),
            last_reviewed_at: new Date(),
          },
          {
            card_id: "7",
            front: "오늘 날씨가 좋습니다",
            back: "Il fait beau aujourd'hui",
            deck_id: "1",
            repetition_count: 2,
            ease_factor: 1.4,
            next_due_at: new Date(
              Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000,
            ),
            last_reviewed_at: new Date(),
          },
          {
            card_id: "8",
            front: "커피를 마시고 싶어요",
            back: "Je voudrais boire du café",
            deck_id: "1",
            repetition_count: 4,
            ease_factor: 1.6,
            next_due_at: new Date(
              Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000,
            ),
            last_reviewed_at: new Date(),
          },
        ],
        unknown_words: [
          {
            card_id: "3",
            front: "그",
            back: "That",
            deck_id: "1",
            repetition_count: 0,
            ease_factor: 1.3,
            next_due_at: new Date(
              Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000,
            ),
            last_reviewed_at: new Date(),
          },
          {
            card_id: "4",
            front: "빵집이 매우 싸요",
            back: "La boulangerie est très bon marché",
            deck_id: "1",
            repetition_count: 0,
            ease_factor: 1.3,
            next_due_at: new Date(
              Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000,
            ),
            last_reviewed_at: new Date(),
          },
          {
            card_id: "5",
            front: "나는 산책을 할 때 발이 아프다",
            back: "J'ai très mal aux pieds quand fais de la randonnée.",
            deck_id: "1",
            repetition_count: 0,
            ease_factor: 1.3,
            next_due_at: new Date(
              Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000,
            ),
            last_reviewed_at: new Date(),
          },
          {
            card_id: "9",
            front: "지하철역이 어디에 있습니까?",
            back: "Où se trouve la station de métro?",
            deck_id: "1",
            repetition_count: 0,
            ease_factor: 1.3,
            next_due_at: new Date(
              Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000,
            ),
            last_reviewed_at: new Date(),
          },
          {
            card_id: "10",
            front: "이 책은 매우 재미있습니다",
            back: "Ce livre est très intéressant",
            deck_id: "1",
            repetition_count: 0,
            ease_factor: 1.3,
            next_due_at: new Date(
              Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000,
            ),
            last_reviewed_at: new Date(),
          },
          {
            card_id: "11",
            front: "저는 주말에 영화를 보러 갈 거예요",
            back: "Je vais aller voir un film ce weekend",
            deck_id: "1",
            repetition_count: 0,
            ease_factor: 1.3,
            next_due_at: new Date(
              Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000,
            ),
            last_reviewed_at: new Date(),
          },
          {
            card_id: "12",
            front: "이 음식은 너무 맵습니다",
            back: "Cette nourriture est trop épicée",
            deck_id: "1",
            repetition_count: 0,
            ease_factor: 1.3,
            next_due_at: new Date(
              Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000,
            ),
            last_reviewed_at: new Date(),
          },
        ],
        current_index: 0,
        is_ended: true,
      }),
    )

    return <SessionEndedSplashScreen />
  },
  args: {},
}

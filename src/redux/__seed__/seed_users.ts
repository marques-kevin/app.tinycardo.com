import type { UserEntity } from "@/modules/authentication/entities/user_entity"

export const seed_authenticated_user: UserEntity = {
  id: "1",
  email: "test@example.com",
}

export const seed_users: UserEntity[] = [
  seed_authenticated_user,
  {
    id: "2",
    email: "test-2@example.com",
  },
]

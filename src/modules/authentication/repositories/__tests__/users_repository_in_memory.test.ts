import { UsersRepositoryInMemory } from "@/modules/authentication/repositories/users_repository_in_memory"
import { describe, it, expect } from "vitest"

describe("UsersRepositoryInMemory", () => {
  it("should be able to get the google authentication url", async () => {
    const repository = new UsersRepositoryInMemory()
    const url = await repository.get_google_authentication_url()

    expect(url).toBe("https://www.google.com")
  })

  it("should be able to post the google authentication code", async () => {
    const repository = new UsersRepositoryInMemory()
    const { user_id, jwt } = await repository.post_google_authentication_code()

    expect(user_id).toBe("1")
    expect(jwt).toBe("test_jwt")
  })

  it("the user should be null when no user is authenticated", async () => {
    const repository = new UsersRepositoryInMemory()
    const user = await repository.get_authenticated_user()

    expect(user).toBeNull()
  })

  it("the user should be the authenticated user when a user is authenticated", async () => {
    const repository = new UsersRepositoryInMemory({
      user: { id: "1", email: "test@example.com" },
    })
    const user = await repository.get_authenticated_user()

    expect(user).toEqual({ id: "1", email: "test@example.com" })
  })
})

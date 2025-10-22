import type { DecksRepository } from "@/modules/decks/repositories/decks_repository"
import { DecksRepositoryInMemory } from "@/modules/decks/repositories/decks_repository_in_memory"
import type { DownloaderService } from "@/modules/global/services/downloader_service/downloader_service"
import { DownloaderServiceWindow } from "@/modules/global/services/downloader_service/downloader_service_window"
import type { LocalStorageService } from "@/modules/global/services/localstorage_service/localstorage_service"
import { LocalStorageServiceInMemory } from "@/modules/global/services/localstorage_service/localstorage_service_in_memory"
import { LocalStorageServiceWindow } from "@/modules/global/services/localstorage_service/localstorage_service_window"
import type { LocationService } from "@/modules/global/services/location_service/location_service"
import { LocationServiceInMemory } from "@/modules/global/services/location_service/location_service_in_memory"
import { LocationServiceWindow } from "@/modules/global/services/location_service/location_service_window"
import type { SessionsRepository } from "@/modules/sessions/repositories/sessions_repository"
import { SessionsRepositoryInMemory } from "@/modules/sessions/repositories/sessions_repository_in_memory"
import { SessionsRepositoryApi } from "@/modules/sessions/repositories/sessions_repository_api"
import type { UsersRepository } from "@/modules/authentication/repositories/users_repository"
import { UsersRepositoryInMemory } from "@/modules/authentication/repositories/users_repository_in_memory"
import { UsersRepositoryApi } from "@/modules/authentication/repositories/users_repository_api"
import type { SessionHelpService } from "@/modules/sessions/services/session_help_service/session_help_service"
import { SessionHelpServiceInMemory } from "@/modules/sessions/services/session_help_service/session_help_service_in_memory"
import { SessionHelpServiceApi } from "@/modules/sessions/services/session_help_service/session_help_service_api"
import { DecksRepositoryApi } from "@/modules/decks/repositories/decks_repository_api"
import type { CardsRepository } from "@/modules/cards/repositories/cards_repository"
import { CardsRepositoryInMemory } from "@/modules/cards/repositories/cards_repository_in_memory"
import { CardsRepositoryApi } from "@/modules/cards/repositories/cards_repository_api"

export type Dependencies = {
  location_service: LocationService
  local_storage_service: LocalStorageService
  downloader_service: DownloaderService
  decks_repository: DecksRepository
  cards_repository: CardsRepository
  sessions_repository: SessionsRepository
  users_repository: UsersRepository
  session_help_service: SessionHelpService
}

export function build_dependencies(
  mode: "test" | "development" | "production",
): Dependencies {
  if (mode === "test") {
    return {
      location_service: new LocationServiceInMemory(),
      local_storage_service: new LocalStorageServiceInMemory(),
      downloader_service: new DownloaderServiceWindow(),
      decks_repository: new DecksRepositoryInMemory(),
      cards_repository: new CardsRepositoryInMemory(),
      sessions_repository: new SessionsRepositoryInMemory(),
      users_repository: new UsersRepositoryInMemory(),
      session_help_service: new SessionHelpServiceInMemory(),
    }
  }

  if (mode === "development") {
    return {
      location_service: new LocationServiceWindow(),
      local_storage_service: new LocalStorageServiceWindow(),
      downloader_service: new DownloaderServiceWindow(),
      decks_repository: new DecksRepositoryInMemory(),
      cards_repository: new CardsRepositoryInMemory(),
      sessions_repository: new SessionsRepositoryInMemory(),
      users_repository: new UsersRepositoryInMemory({
        user: { id: "1", email: "test@example.com" },
      }),
      session_help_service: new SessionHelpServiceInMemory(),
    }
  }

  return {
    location_service: new LocationServiceWindow(),
    local_storage_service: new LocalStorageServiceWindow(),
    downloader_service: new DownloaderServiceWindow(),
    decks_repository: new DecksRepositoryApi(),
    cards_repository: new CardsRepositoryApi(),
    sessions_repository: new SessionsRepositoryApi(),
    users_repository: new UsersRepositoryApi(),
    session_help_service: new SessionHelpServiceApi(),
  }
}

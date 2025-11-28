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
import type { DiscoverDecksRepository } from "@/modules/discover/repositories/discover_decks_repository"
import { DiscoverDecksRepositoryInMemory } from "@/modules/discover/repositories/discover_decks_repository_in_memory"
import { DiscoverDecksRepositoryApi } from "@/modules/discover/repositories/discover_decks_repository_api"
import type { ToastService } from "@/modules/global/services/toast_service/toast_service"
import { ToastServiceInMemory } from "@/modules/global/services/toast_service/toast_service_in_memory"
import { ToastServiceSonner } from "@/modules/global/services/toast_service/toast_service_sonner"
import type { StreakRepository } from "@/modules/streak/repositories/streak_repository/streak_repository"
import { StreakRepositoryInMemory } from "@/modules/streak/repositories/streak_repository/streak_repository_in_memory"

import { seed_decks } from "@/redux/__seed__/seed_decks"
import { seed_cards } from "@/redux/__seed__/seed_cards"
import { seed_discover_decks } from "@/redux/__seed__/seed_discover_decks"
import { seed_authenticated_user } from "@/redux/__seed__/seed_users"
import { seed_streaks } from "@/redux/__seed__/seed_streaks"
import { seed_lessons } from "@/redux/__seed__/seed_lessons"

import { StreakRepositoryApi } from "@/modules/streak/repositories/streak_repository/streak_repository_api"
import type { PlausibleService } from "@/modules/global/services/plausible_service/plausible_service"
import { PlausibleServiceInMemory } from "@/modules/global/services/plausible_service/plausible_service_in_memory"
import { PlausibleServiceWindow } from "@/modules/global/services/plausible_service/plausible_service_window"
import { seed_history } from "./__seed__/seed_history"
import type { AudioService } from "@/modules/global/services/audio_service/audio_service"
import type { HttpService } from "@/modules/global/services/http_service/http_service"
import { AudioServiceInMemory } from "@/modules/global/services/audio_service/audio_service_in_memory"
import { HttpServiceInMemory } from "@/modules/global/services/http_service/http_service_in_memory"
import { AudioServiceWindow } from "@/modules/global/services/audio_service/audio_service_window"
import { HttpServiceWindow } from "@/modules/global/services/http_service/http_service_window"
import type { ThemeService } from "@/modules/global/services/theme_service/theme_service"
import { ThemeServiceInMemory } from "@/modules/global/services/theme_service/theme_service_in_memory"
import { ThemeServiceWindow } from "@/modules/global/services/theme_service/theme_service_window"
import type { AnalyticsService } from "@/modules/global/services/analytics_service/analytics_service"
import { AnalyticsServiceInMemory } from "@/modules/global/services/analytics_service/analytics_service_in_memory"
import { AnalyticsServiceMixpanel } from "@/modules/global/services/analytics_service/analytics_service_mixpanel"

export type Dependencies = {
  location_service: LocationService
  local_storage_service: LocalStorageService
  theme_service: ThemeService
  downloader_service: DownloaderService
  decks_repository: DecksRepository
  sessions_repository: SessionsRepository
  users_repository: UsersRepository
  session_help_service: SessionHelpService
  discover_decks_repository: DiscoverDecksRepository
  toast_service: ToastService
  streak_repository: StreakRepository
  plausible_service: PlausibleService
  audio_service: AudioService
  http_service: HttpService
  analytics_service: AnalyticsService
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
      sessions_repository: new SessionsRepositoryInMemory(),
      users_repository: new UsersRepositoryInMemory(),
      session_help_service: new SessionHelpServiceInMemory(),
      discover_decks_repository: new DiscoverDecksRepositoryInMemory(),
      toast_service: new ToastServiceInMemory(),
      streak_repository: new StreakRepositoryInMemory(),
      plausible_service: new PlausibleServiceInMemory(),
      audio_service: new AudioServiceInMemory(),
      http_service: new HttpServiceInMemory(),
      theme_service: new ThemeServiceInMemory(),
      analytics_service: new AnalyticsServiceInMemory(),
    }
  }

  // if (mode === "development") {
  //   return {
  //     location_service: new LocationServiceWindow(),
  //     local_storage_service: new LocalStorageServiceWindow(),
  //     downloader_service: new DownloaderServiceWindow(),
  //     decks_repository: new DecksRepositoryInMemory({
  //       decks: seed_decks,
  //       cards: seed_cards,
  //       lessons: seed_lessons,
  //     }),
  //     sessions_repository: new SessionsRepositoryInMemory({
  //       history: seed_history,
  //     }),
  //     users_repository: new UsersRepositoryInMemory({
  //       user: seed_authenticated_user,
  //     }),
  //     session_help_service: new SessionHelpServiceInMemory(),
  //     discover_decks_repository: new DiscoverDecksRepositoryInMemory({
  //       decks: seed_discover_decks,
  //     }),
  //     toast_service: new ToastServiceSonner(),
  //     streak_repository: new StreakRepositoryInMemory({
  //       streaks: seed_streaks,
  //     }),
  //     plausible_service: new PlausibleServiceInMemory(),
  //     audio_service: new AudioServiceWindow(),
  //     http_service: new HttpServiceWindow(),
  //     theme_service: new ThemeServiceWindow(),
  //     analytics_service: new AnalyticsServiceMixpanel(),
  //   }
  // }

  return {
    location_service: new LocationServiceWindow(),
    local_storage_service: new LocalStorageServiceWindow(),
    downloader_service: new DownloaderServiceWindow(),
    decks_repository: new DecksRepositoryApi(),
    sessions_repository: new SessionsRepositoryApi(),
    users_repository: new UsersRepositoryApi(),
    session_help_service: new SessionHelpServiceApi(),
    discover_decks_repository: new DiscoverDecksRepositoryApi(),
    toast_service: new ToastServiceSonner(),
    streak_repository: new StreakRepositoryApi(),
    plausible_service: new PlausibleServiceWindow(),
    audio_service: new AudioServiceWindow(),
    http_service: new HttpServiceWindow(),
    theme_service: new ThemeServiceWindow(),
    analytics_service: new AnalyticsServiceMixpanel(),
  }
}

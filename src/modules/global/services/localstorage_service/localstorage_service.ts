export const LOCAL_STORAGE_KEYS = {
  language: "language",
  theme: "theme",
  measure_unit: "measure_unit",
  how_many_words_to_review: "how_many_words_to_review",
  how_many_words_to_learn_new_words: "how_many_words_to_learn_new_words",
  how_many_words_to_randomized: "how_many_words_to_randomized",
  jwt: "jwt",
}

export type LocalStorageKey =
  (typeof LOCAL_STORAGE_KEYS)[keyof typeof LOCAL_STORAGE_KEYS]

export interface LocalStorageService {
  get(key: LocalStorageKey): Promise<string | null>
  set(key: LocalStorageKey, value: string): Promise<void>
  delete(key: LocalStorageKey): Promise<void>
}

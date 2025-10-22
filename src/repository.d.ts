export type RepositoryResponse<T> =
  | ({ error: false } & { body: T })
  | {
      error: true
      message: string
    }

import { type RootState } from "@/redux/store"
import { catch_error } from "@/modules/global/redux/global_actions"
import { type Middleware, type UnknownAction } from "@reduxjs/toolkit"
import * as Sentry from "@sentry/react"

/**
 * Context information for error reporting
 */
interface ErrorContext {
  action: string
  payload: unknown
  source: "redux_action"
}

/**
 * Creates Sentry error context from Redux action data
 */
const createErrorContext = (
  action: UnknownAction,
  errorPayload: unknown = action.payload,
): ErrorContext => ({
  action: action.type,
  payload: errorPayload,
  source: "redux_action",
})

/**
 * Reports an error to Sentry with Redux-specific context
 * @param {unknown} error - The error to report
 * @param {ErrorContext} context - Context information about the error
 */
const reportError = (error: unknown, context: ErrorContext): void => {
  Sentry.captureException(error, {
    extra: {
      context,
    },
  })
}

/**
 * Redux middleware that captures and reports errors to Sentry
 *
 * Handles two types of errors:
 * 1. Synchronous errors from reducers and middleware
 * 2. Asynchronous errors from rejected thunk actions
 *
 * All errors are:
 * - Reported to Sentry with action context
 * - Tagged as "redux_action" for filtering
 * - Preserved in their original form (sync errors re-thrown, async errors passed through)
 *
 */
export const redux_catch_errors_middleware: Middleware<object, RootState> =
  (api) => (next) => (action) => {
    const typedAction = action as UnknownAction

    /**
     * Handle async thunk rejections
     */
    if (typedAction.type?.endsWith("/rejected") && typedAction.error) {
      const context = createErrorContext(typedAction, typedAction.error)
      reportError(typedAction.error, context)

      api.dispatch(
        // @ts-expect-error unknown
        catch_error({
          // @ts-expect-error unknown
          message: context.payload.message,
          // @ts-expect-error unknown
          stack: context.payload.stack,
        }),
      )

      return next(action)
    }

    /**
     * Handle synchronous errors
     */
    try {
      return next(action)
    } catch (error) {
      const context = createErrorContext(typedAction)
      reportError(error, context)
      /**
       * Re-throw to maintain error flow
       */
      throw error
    }
  }

import ReactMarkdown from "react-markdown"
import { connector, type ContainerProps } from "./session_help_dialog.container"

export function Wrapper(props: ContainerProps) {
  return (
    <dialog className="modal" open={props.is_open}>
      <div className="modal-box max-h-[90vh] w-full max-w-3xl p-8">
        <div className="max-w-none py-4">
          {props.is_loading ? (
            <div className="flex items-center gap-2">
              <span className="loading loading-spinner loading-md" />
              <span>Generating explanation…</span>
            </div>
          ) : props.content ? (
            <article
              className="prose prose-lg"
              style={{
                wordBreak: "keep-all",
              }}
            >
              <ReactMarkdown>{props.content}</ReactMarkdown>
            </article>
          ) : (
            <p>No help available.</p>
          )}
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={props.on_close}>
            Close
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={props.on_close}>
        <button>close</button>
      </form>
    </dialog>
  )
}

export const SessionHelpDialog = connector(Wrapper)

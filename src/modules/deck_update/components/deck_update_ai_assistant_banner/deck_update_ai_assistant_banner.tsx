import { SparklesIcon } from "lucide-react"

export const Wrapper = () => {
  return (
    <div role="alert" className="card card-lg border-base-300 border-2">
      <div className="card-body">
        <SparklesIcon className="fill-primary text-primary-content size-6" />

        <div>
          <h3 className="card-title">
            Envie de gagner du temps pour modifier le deck ?
          </h3>

          <div>
            Vous pouvez utiliser l'assistant IA et lui dire quoi faire. Il peut
            créer des leçons, ajouter des cartes et même corriger les fautes
            d'orthographes.
          </div>
        </div>

        <div>
          <button className="btn btn-lg btn-primary mt-4">
            Utiliser l'assistant IA ?
          </button>
        </div>
      </div>
    </div>
  )
}

export const DeckUpdateAiAssistantBanner = Wrapper

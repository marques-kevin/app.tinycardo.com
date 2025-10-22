import { ApiService } from "@/modules/global/services/api_service/api_service"
import type {
  ExplainSentenceParams,
  SessionHelpService,
} from "@/modules/sessions/services/session_help_service/session_help_service"

type ExplainSentenceApiParams = {
  sentence_to_explain: string
  language_of_sentence: string
  language_of_the_explanation: string
}

type ExplainSentenceApiResponse = {
  explanation: string
}

export class SessionHelpServiceApi implements SessionHelpService {
  private api = new ApiService()

  async explain_sentence(params: ExplainSentenceParams): Promise<string> {
    const payload: ExplainSentenceApiParams = {
      sentence_to_explain: params.sentence_to_explain,
      language_of_sentence: params.language_of_sentence,
      language_of_the_explanation: params.language_of_the_explanation,
    }

    const data = await this.api.post<ExplainSentenceApiResponse>(
      "/sessions/explain_sentence",
      payload,
    )

    return data.explanation
  }
}

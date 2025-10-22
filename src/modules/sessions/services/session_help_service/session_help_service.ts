export type ExplainSentenceParams = {
  sentence_to_explain: string
  language_of_sentence: string
  language_of_the_explanation: string
}

export interface SessionHelpService {
  explain_sentence(params: ExplainSentenceParams): Promise<string>
}

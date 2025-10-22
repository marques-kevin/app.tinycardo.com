import type {
  ExplainSentenceParams,
  SessionHelpService,
} from "@/modules/sessions/services/session_help_service/session_help_service"

export class SessionHelpServiceInMemory implements SessionHelpService {
  async explain_sentence(params: ExplainSentenceParams): Promise<string> {
    const {
      sentence_to_explain,
      language_of_sentence,
      language_of_the_explanation,
    } = params
    return `# Help (${language_of_sentence} → ${language_of_the_explanation})

## Sentence
${sentence_to_explain}


## Examples
- Example sentence 1
- Example sentence 2

## Grammar Notes
- Grammar point 1
- Grammar point 2

## Tips
- Usage tip 1
- Usage tip 2

Response time: ${Date.now()}`
  }
}

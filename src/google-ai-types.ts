// --- Base types --- //

/**
 * The category of a rating.  
 * These categories cover various kinds of harms that developers may wish to adjust.
 *
 * @export
 * @typedef {HarmCategory}
 */
export type HarmCategory = 'HARM_CATEGORY_UNSPECIFIED' | 'HARM_CATEGORY_DEROGATORY' | 'HARM_CATEGORY_TOXICITY' | 'HARM_CATEGORY_VIOLENCE' | 'HARM_CATEGORY_SEXUAL' | 'HARM_CATEGORY_MEDICAL' | 'HARM_CATEGORY_DANGEROUS';

/**
 * The probability that a piece of content is harmful.  
 * The classification system gives the probability of the content being unsafe.  
 * This does not indicate the severity of harm for a piece of content.
 *
 * @export
 * @typedef {HarmProbability}
 */
export type HarmProbability = 'HARM_PROBABILITY_UNSPECIFIED' | 'NEGLIGIBLE' | 'LOW' | 'MEDIUM' | 'HIGH';

/**
 * Block at and beyond a specified harm probability.
 *
 * @export
 * @typedef {HarmBlockThreshold}
 */
export type HarmBlockThreshold = 'HARM_BLOCK_THRESHOLD_UNSPECIFIED' | 'BLOCK_LOW_AND_ABOVE' | 'BLOCK_MEDIUM_AND_ABOVE' | 'BLOCK_ONLY_HIGH' | 'BLOCK_NONE';

/**
 * A list of reasons why content may have been blocked.
 *
 * @export
 * @typedef {BlockedReason}
 */
export type BlockedReason = 'BLOCKED_REASON_UNSPECIFIED' | 'SAFETY' | 'OTHER';

/**
 * Content filtering metadata associated with processing a single request.
 *
 * @export
 * @interface ContentFilter
 * @typedef {ContentFilter}
 */
export interface ContentFilter {
  /**
   * The reason content was blocked during request processing.
   *
   * @type {BlockedReason}
   */
  reason: BlockedReason;
  /**
   * A string that describes the filtering behavior in more detail.
   *
   * @type {string}
   */
  message: string;
}

/**
 * Safety rating for a piece of content.  
 * The safety rating contains the category of harm and the harm probability level in that category for a piece of content.  
 * Content is classified for safety across a number of harm categories and the probability of the harm classification is included here.
 *
 * @export
 * @interface SafetyRating
 * @typedef {SafetyRating}
 */
export interface SafetyRating {
  /**
   * Required. The category for this rating.
   *
   * @type {HarmCategory}
   */
  category: HarmCategory;
  /**
   * Required. The probability of harm for this content.
   *
   * @type {HarmProbability}
   */
  probability: HarmProbability;
}

/**
 * Safety setting, affecting the safety-blocking behavior.  
 * Passing a safety setting for a category changes the allowed proability that content is blocked.
 *
 * @export
 * @interface SafetySetting
 * @typedef {SafetySetting}
 */
export interface SafetySetting {
  /**
   * Required. The category for this setting.
   *
   * @type {HarmCategory}
   */
  category: HarmCategory;
  /**
   * Required. Controls the probability threshold at which harm is blocked.
   *
   * @type {HarmBlockThreshold}
   */
  threshold: HarmBlockThreshold;
}

/**
 * Safety feedback for an entire request.
 *
 * @export
 * @interface SafetyFeedback
 * @typedef {SafetyFeedback}
 */
export interface SafetyFeedback {
  /**
   * Safety rating evaluated from content.
   *
   * @type {SafetyRating}
   */
  rating: SafetyRating;
  /**
   * Safety settings applied to the request.
   *
   * @type {SafetySetting}
   */
  setting: SafetySetting;
}

/**
 * Output text returned from a model.
 *
 * @export
 * @interface TextCompletion
 * @typedef {TextCompletion}
 */
export interface TextCompletion {
  /**
   * Output only. The generated text returned from the model.
   *
   * @type {string}
   */
  output: string;
  /**
   * Ratings for the safety of a response.  
   * There is at most one rating per category.
   *
   * @type {SafetyRating[]}
   */
  safetyRatings: SafetyRating[];
  /**
   * Output only. Citation information for model-generated output in this TextCompletion.  
   * This field may be populated with attribution information for any text included in the output.
   *
   * @type {CitationMetadata}
   */
  citationMetadata: CitationMetadata;
}

/**
 * A collection of source attributions for a piece of content.
 *
 * @export
 * @interface CitationMetadata
 * @typedef {CitationMetadata}
 */
export interface CitationMetadata {
  /**
   * A citation to a source for a portion of a specific response.
   *
   * @type {{startIndex: number; endIndex: number; uri: string; license: string;}[]}
   */
  citationSources: {
    /**
     * Optional. Start of segment of the response that is attributed to this source.  
     * Index indicates the start of the segment, measured in bytes.
     *
     * @type {?number}
     */
    startIndex?: number;
    /**
     * Optional. End of the attributed segment, exclusive.
     *
     * @type {?number}
     */
    endIndex?: number;
    /**
     * Optional. URI that is attributed as a source for a portion of the text.
     *
     * @type {?string}
     */
    uri?: string;
    /**
     * Optional. License for the GitHub project that is attributed as a source for segment.  
     * License info is required for code citations.
     *
     * @type {?string}
     */
    license?: string;
  }[]
}

/**
 * The base unit of structured text.
 *
 * @export
 * @interface Message
 * @typedef {Message}
 */
export interface Message {
  /**
   * Optional. The author of this Message.  
   * This serves as a key for tagging the content of this Message when it is fed to the model as text.  
   * The author can be any alphanumeric string.
   *
   * @type {?string}
   */
  author?: string;
  /**
   * Required. The text content of the structured Message.
   *
   * @type {string}
   */
  content: string;
  /**
   * Output only. Citation information for model-generated content in this Message.  
   * If this Message was generated as output from the model, this field may be populated with attribution information for any text included in the content.  
   * This field is used only on output.
   *
   * @type {?CitationMetadata}
   */
  citationMetadata?: CitationMetadata;
}

/**
 * The embedding generated from the input text.
 *
 * @export
 * @interface Embedding
 * @typedef {Embedding}
 */
export interface Embedding {
  /**
   * A list of floats representing the embedding.
   *
   * @type {number[]}
   */
  value: number[];
}

/**
 * An input/output example used to instruct the Model.  
 * It demonstrates how the model should respond or format its response.
 *
 * @export
 * @typedef {Example}
 */
export type Example = [string, string];

/**
 * Response format.
 *
 * @export
 * @typedef {Format}
 */
export type Format = 'json' | 'markdown';

/**
 * Type map for responses by format.
 *
 * @export
 * @interface ResponseByFormat
 * @typedef {ResponseByFormat}
 * @template T
 */
export interface ResponseByFormat<T> {
  /**
   * JSON response format.
   *
   * @type {T}
   */
  json: T;
  /**
   * Markdown response format.
   *
   * @type {string}
   */
  markdown: string;
}

// --- Command GenerateText --- //

/**
 * Generate text configuration.
 *
 * @export
 * @interface GenerateTextConfig
 * @typedef {GenerateTextConfig}
 * @template {Format} [F='markdown']
 */
export interface GenerateTextConfig<F extends Format = 'markdown'> {
  /**
   * Any model capable of `generateText`.  
   * Models available: `text-bison-001`.  
   * Default: `text-bison-001`.
   *
   * @type {'text-bison-001'}
   */
  model: 'text-bison-001';
  /**
   * How many responses to generate.  
   * Default: `1`.
   *
   * @type {number}
   */
  candidate_count: number;
  /**
   * Temperature of model.  
   * Default: `0`.
   *
   * @type {number}
   */
  temperature: number;
  /**
   * top_p of model.  
   * Default: `0.95`.
   *
   * @type {number}
   */
  top_p: number;
  /**
   * top_k of model.  
   * Default: `40`.
   *
   * @type {number}
   */
  top_k: number;
  /**
   * Return as JSON or Markdown.  
   * Default: `PaLM.FORMATS.MD`.
   *
   * @type {Format}
   */
  format: F;
}

/**
 * `generateText` response.
 *
 * @export
 * @interface GenerateTextResponse
 * @typedef {GenerateTextResponse}
 */
export interface GenerateTextResponse {
  /**
   * Possible completions.
   *
   * @type {TextCompletion[]}
   */
  candidates: TextCompletion[];
  /**
   * Content filters.
   *
   * @type {ContentFilter[]}
   */
  filters: ContentFilter[];
  /**
   * Safety feedbacks.
   *
   * @type {?SafetyFeedback[]}
   */
  safetyFeedback?: SafetyFeedback[]
}

// --- Command Ask --- //

/**
 * Chat ask configuration.
 *
 * @export
 * @interface AskConfig
 * @typedef {AskConfig}
 * @template {Format} [F='markdown']
 */
export interface AskConfig<F extends Format = 'markdown'> {
  /**
   * Any model capable of `generateMessage`.  
   * Models available: `chat-bison-001`.  
   * Default: `chat-bison-001`.
   *
   * @type {'chat-bison-001'}
   */
  model: 'chat-bison-001';
  /**
   * How many responses to generate.  
   * Default: `1`.
   *
   * @type {number}
   */
  candidate_count: number;
  /**
   * Temperature of model.  
   * Default: `0.7`.
   *
   * @type {number}
   */
  temperature: number;
  /**
   * top_p of model.  
   * Default: `0.95`.
   *
   * @type {number}
   */
  top_p: number;
  /**
   * top_k of model.  
   * Default: `40`.
   *
   * @type {number}
   */
  top_k: number;
  /**
   * Return as JSON or Markdown.  
   * Default: `PaLM.FORMATS.MD`.
   *
   * @type {Format}
   */
  format: F;
  /**
   * Additional context to the query.  
   * Optional.
   *
   * @type {string}
   */
  context: string;
  /**
   * Show PaLM how to respond.  
   * Optional.  
   * 
   * @example
   * new PaLM(API_KEY).ask("x^2+2x+1", {
   *   context: "Simplify the expression",
   *   examples: [
   *     ["x^2-4", "(x-2)(x+2)"],
   *     ["2x+2", "2(x+1)"],
   *     // ... etc
   *   ],
   * });
   * @type {Example[]}
   */
  examples: Example[];
}

/**
 * `generateMessage` response.
 *
 * @export
 * @interface AskResponse
 * @typedef {AskResponse}
 */
export interface AskResponse {
  /**
   * Possible replies.
   *
   * @type {Message[]}
   */
  candidates: Message[];
  /**
   * Message history.
   *
   * @type {Message[]}
   */
  messages: Message[];
  /**
   * Content filters.
   *
   * @type {ContentFilter[]}
   */
  filters: ContentFilter[];
}

// --- Command EmbedText --- //

/**
 * Embed text configuration.
 *
 * @export
 * @interface EmbedTextConfig
 * @typedef {EmbedTextConfig}
 */
export interface EmbedTextConfig {
  /**
   * Any model capable of `embedText`.  
   * Models available: `embedding-gecko-001`.  
   * Default: `embedding-gecko-001`.
   *
   * @type {'embedding-gecko-001'}
   */
  model: 'embedding-gecko-001';
}

/**
 * `embedText` response.
 *
 * @export
 * @interface EmbedTextResponse
 * @typedef {EmbedTextResponse}
 */
export interface EmbedTextResponse {
  /**
   * Text embedding.
   *
   * @type {Embedding}
   */
  embedding: Embedding;
}

// --- Command CreateChat --- //

/**
 * Create chat configuration.
 * 
 * @export
 * @typedef {CreateChatConfig}
 */
export type CreateChatConfig = Omit<AskConfig, 'format'> & {messages: Message[]; max_output_tokens: number};

/**
 * Chat ask configuration.
 *
 * @export
 * @typedef {ChatAskConfig}
 * @template F
 */
export type ChatAskConfig<F extends Format = 'markdown'> = Pick<AskConfig<F>, 'format'>;

// --- Utility --- //

/**
 * Type map for PaLM query.
 *
 * @export
 * @interface QueryType
 * @typedef {QueryType}
 */
export interface QueryType {
  /**
   * `generatedText` command response.
   *
   * @type {GenerateTextResponse}
   */
  generateText: GenerateTextResponse;
  /**
   * `generateMessage` command response.
   *
   * @type {AskResponse}
   */
  generateMessage: AskResponse;
  /**
   * `embedText` command response.
   *
   * @type {EmbedTextResponse}
   */
  embedText: EmbedTextResponse;
}

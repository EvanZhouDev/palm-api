import { QueryType, Format, GenerateTextConfig, AskConfig, ResponseByFormat, GenerateTextResponse, AskResponse, EmbedTextConfig, CreateChatConfig, ChatAskConfig, Message } from "./google-ai-types";

/**
 * PaLM API.
 *
 * @class PaLM
 * @typedef {PaLM}
 */
class PaLM {
  /**
   * Available response formats.
   *
   * @public
   * @static
   * @type {{ readonly JSON: "json"; readonly MD: "markdown"; }}
   */
  public static readonly FORMATS = {
    JSON: 'json',
    MD: 'markdown'
  } as const;

  /**
   * Fetch for requests.
   *
   * @type {typeof fetch}
   */
  #fetch: typeof fetch;

  /**
   * API key.
   *
   * @private
   * @type {string}
   */
  private key: string;

  /**
   * @constructor
   * @public
   * @param {string} key
   * @param {{ fetch?: typeof fetch }} [rawConfig={}]
   */
  public constructor(key: string, rawConfig: { fetch?: typeof fetch } = {}) {
    let defaultFetch: typeof fetch | undefined;

    try {
      defaultFetch = fetch;
    } catch {}

    const config = this.parseConfig({ fetch: defaultFetch }, rawConfig);

    if (!config.fetch) {
      throw new Error('Fetch was not found in environment, and no polyfill was provided. Please install a polyfill, and put it in the `fetch` property of the PaLM configuration.');
    }

    this.#fetch = config.fetch;
    this.key = key;
  }

  /**
   * Parses a configuration and merges it with the defaults.
   *
   * @internal
   * @private
   * @template {{}} T
   * @param {T} defaults
   * @param {Partial<T>} [raw={}]
   * @returns {T}
   */
  private parseConfig<T extends {}>(defaults: T, raw: Partial<T> = {}): T {
    const extras = Object.keys(raw).filter(item => !Object.keys(defaults).includes(item));
    if (extras.length) {
      throw new Error(`These following configurations are not available on this function: ${extras.join(', ')}`);
    }
    return { ...defaults, ...raw };
  }

  /**
   * Executes a query to the Google PaLM API.
   *
   * @internal
   * @private
   * @async
   * @template {keyof QueryType} K
   * @param {string} model
   * @param {K} command
   * @param {object} body
   * @returns {Promise<QueryType[K]>}
   */
  private async query<K extends keyof QueryType>(model: string, command: K, body: object): Promise<QueryType[K]> {
    const opts = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    };

    const response = await this.#fetch(`https://generativelanguage.googleapis.com/v1beta2/models/${model}:${command}?key=${this.key}`, opts);
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error.message);
    }

    return json;
  }

  /**
   * Uses the `generateText` capable models to let PaLM generate text.
   *
   * @public
   * @async
   * @template {Format} [F='markdown'] response format.
   * @param {string} message
   * @param {Partial<GenerateTextConfig<F>>} [rawConfig={}]
   * @returns {Promise<GeneratedTextResponseFormat[F]>}
   */
  public async generateText<F extends Format = 'markdown'>(message: string, rawConfig: Partial<GenerateTextConfig<F>> = {}): Promise<ResponseByFormat<GenerateTextResponse>[F]> {
    const config = this.parseConfig<GenerateTextConfig<Format>>(
      {
        candidate_count: 1,
        temperature: 0,
        top_p: 0.95,
        top_k: 40,
        model: 'text-bison-001',
        format: PaLM.FORMATS.MD
      },
      rawConfig
    );

    const response = await this.query(config.model, 'generateText', {
      prompt: { text: message },
      candidate_count: config.candidate_count,
      temperature: config.temperature,
      top_p: config.top_p,
      top_k: config.top_k
    });

    switch (config.format) {
      case PaLM.FORMATS.MD:
        return response.candidates[0].output as ResponseByFormat<GenerateTextResponse>[F];
      case PaLM.FORMATS.JSON:
        return response as ResponseByFormat<GenerateTextResponse>[F];
      default:
        throw new Error(`${config.format} is not a valid format. Use PaLM.FORMATS.MD or PaLM.FORMATS.JSON.`);
    }
  }

  /**
   * Uses the `generateMessage` capable models to provide a high-quality LLM experience, with context, examples, and more.
   *
   * @public
   * @async
   * @template {Format} [F='markdown'] response format.
   * @param {string} message
   * @param {Partial<AskConfig<F>>} [rawConfig={}]
   * @returns {Promise<ResponseByFormat<AskResponse>[F]>}
   */
  public async ask<F extends Format = 'markdown'>(message: string, rawConfig: Partial<AskConfig<F>> = {}): Promise<ResponseByFormat<AskResponse>[F]> {
    const config = this.parseConfig<AskConfig<Format>>(
      {
        candidate_count: 1,
        temperature: 0.7,
        top_p: 0.95,
        top_k: 40,
        model: 'chat-bison-001',
        format: PaLM.FORMATS.MD,
        context: '',
        examples: []
      },
      rawConfig
    );

    const response = await this.query(config.model, 'generateMessage', {
      prompt: {
        context: config.context, messages: [{ content: message }], examples: config.examples.map(example => ({
          input: { content: example[0] },
          output: { content: example[1] },
        }))
      },
      candidate_count: config.candidate_count,
      temperature: config.temperature,
      top_p: config.top_p,
      top_k: config.top_k
    });

    switch (config.format) {
      case PaLM.FORMATS.MD:
        return response.candidates[0].content as ResponseByFormat<AskResponse>[F];
      case PaLM.FORMATS.JSON:
        return response as ResponseByFormat<AskResponse>[F];
      default:
        throw new Error(`${config.format} is not a valid format. Use PaLM.FORMATS.MD or PaLM.FORMATS.JSON.`);
    }
  }

  /**
   * Uses PaLM to embed your text into a float matrix with `embedText` enabled models, that you can use for various complex tasks.
   *
   * @public
   * @async
   * @param {string} message
   * @param {Partial<EmbedTextConfig>} [rawConfig={}]
   * @returns {Promise<number[]>}
   */
  public async embed(message: string, rawConfig: Partial<EmbedTextConfig> = {}): Promise<number[]> {
    const config = this.parseConfig<EmbedTextConfig>({model: 'embedding-gecko-001'}, rawConfig);

    const response = await this.query(config.model, 'embedText', { text: message });

    return response.embedding.value;
  }

  /**
   * Uses `generateMessage` capable models to create a chat interface that's simple, fast, and easy to use.
   *
   * @public
   * @param {Partial<CreateChatConfig>} [rawConfig={}]
   * @returns {Chat}
   */
  public createChat(rawConfig: Partial<CreateChatConfig> = {}): Chat {
    return new Chat(this, rawConfig);
  }
}

/**
 * Chat wrapper interface.
 *
 * @export
 * @class Chat
 * @typedef {Chat}
 */
class Chat {
  /**
   * `PaLM` instance.
   *
   * @private
   * @type {PaLM}
   */
  private PaLM: PaLM;

  /**
   * Chat creation configuration.
   *
   * @private
   * @type {CreateChatConfig}
   */
  private config: CreateChatConfig;

  /**
   * Message hystory.
   *
   * @private
   * @type {Message[]}
   */
  private messages: Message[];

  /**
   * @constructor
   * @param {PaLM} PaLM
   * @param {Partial<CreateChatConfig>} [rawConfig={}]
   */
  constructor(PaLM: PaLM, rawConfig: Partial<CreateChatConfig> = {}) {
    this.PaLM = PaLM;
    this.config = this.PaLM['parseConfig']<CreateChatConfig>(
      {
        context: '',
        messages: [],
        examples: [],
        temperature: 0.5,
        candidate_count: 1,
        top_p: 0.95,
        top_k: 40,
        model: 'chat-bison-001',
        max_output_tokens: 1024
      },
      rawConfig
    );
    this.messages = this.config.messages;
  }

  /**
   * Same as {@link PaLM.ask()} but remembers previous messages and responses, to enable continued conversations.
   *
   * @async
   * @template {Format} [F='markdown'] response format.
   * @param {string} message
   * @param {Partial<ChatAskConfig<F>>} [rawConfig={}]
   * @returns {Promise<ResponseByFormat<AskResponse>[F]>}
   */
  async ask<F extends Format = 'markdown'>(message: string, rawConfig: Partial<ChatAskConfig<F>> = {}): Promise<ResponseByFormat<AskResponse>[F]> {
    const config = {
      ...this.config,
      ...this.PaLM['parseConfig']<ChatAskConfig<Format>>({format: PaLM.FORMATS.MD}, rawConfig)
    };

    const response = await this.PaLM['query'](config.model, 'generateMessage', {
      prompt: {
        context: config.context, messages: [...this.messages, { content: message }], examples: config.examples.map(example => ({
          input: { content: example[0] },
          output: { content: example[1] },
        }))
      },
      candidate_count: config.candidate_count,
      temperature: config.temperature,
      top_p: config.top_p,
      top_k: config.top_k,
    });

    if (!response.candidates[0].content) {
      throw new Error(`Request rejected. Got ${(response as any).at(-1)} instead of response.`)
    }

    this.messages.push({ content: message });
    this.messages.push({ content: response.candidates[0].content });

    switch (config.format) {
      case PaLM.FORMATS.MD:
        return response.candidates[0].content as ResponseByFormat<AskResponse>[F];
      case PaLM.FORMATS.JSON:
        return response as ResponseByFormat<AskResponse>[F];
      default:
        throw new Error(`${config.format} is not a valid format. Use PaLM.FORMATS.MD or PaLM.FORMATS.JSON.`);
    }
  }

  /**
   * Exports the message hystory.
   *
   * @returns {Message[]}
   */
  export(): Message[] {
    return this.messages;
  }
}

export default PaLM;
class PaLM {
    static FORMATS = {
        JSON: "json",
        MD: "markdown",
    }

    constructor(key, rawConfig) {
        let config = this.#parseConfig(rawConfig, {
            fetch: fetch,
        })
        this.#fetch = config.fetch;
        this.key = key;
    }

    #parseConfig(raw = {}, defaults = {}) {
        let extras = Object.keys(raw).filter(item => !Object.keys(defaults).includes(item));
        if (extras.length) throw new Error(`These following configurations are not available on this function: ${extras.join(", ")}`)
        return { ...defaults, ...raw };
    }

    async #query(model, command, body) {
        const opts = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }


        const response = await this.#fetch(`https://generativelanguage.googleapis.com/v1beta2/models/${model}:${command}?key=${this.key}`, opts);

        let json = await response.json()
        if (!response.ok) throw new Error(json.error.message);

        return json
    }

    async generateText(message, rawConfig) {
        let config = this.#parseConfig(rawConfig, {
            candidate_count: 1,
            temperature: 0,
            top_p: 0.95,
            top_k: 40,
            model: "text-bison-001",
            format: PaLM.FORMATS.MD,
        })

        let response = await this.#query(config.model, "generateText", {
            prompt: { text: message },
            candidate_count: config.candidate_count,
            temperature: config.temperature,
            top_p: config.top_p,
            top_k: config.top_k,
        })

        switch (config.format) {
            case PaLM.FORMATS.MD:
                return response.candidates[0].output
            case PaLM.FORMATS.JSON:
                return response;
            default:
                throw new Error(`${config.format} is not a valid format. Use PaLM.FORMATS.MD or PaLM.FORMATS.JSON.`)
        }
    }

    async ask(message, rawConfig) {
        let config = this.#parseConfig(rawConfig, {
            candidate_count: 1,
            temperature: 0.7,
            top_p: 0.95,
            top_k: 40,
            model: "chat-bison-001",
            format: PaLM.FORMATS.MD,
            context: "",
            examples: [],
        })

        let response = await this.#query(config.model, "generateMessage", {
            "prompt": {
                context: config.context, messages: [{ content: message }], examples: config.examples.map(x => ({
                    input: { content: x[0] },
                    output: { content: x[1] },
                }))
            },
            candidate_count: config.candidate_count,
            temperature: config.temperature,
            top_p: config.top_p,
            top_k: config.top_k,
        })

        switch (config.format) {
            case PaLM.FORMATS.MD:
                return response.candidates[0].content
            case PaLM.FORMATS.JSON:
                return response;
            default:
                throw new Error(`${config.format} is not a valid format. Use PaLM.FORMATS.MD or PaLM.FORMATS.JSON.`)
        }
    }

    async embed(message, rawConfig) {
        let config = this.#parseConfig(rawConfig, {
            model: "embedding-gecko-001",
        })

        let response = await this.#query(config.model, "embedText", {
            text: message,
        })

        return response.embedding.value;
    }

    createChat(rawConfig) {
        class Chat {
            constructor(PaLM, rawConfig = {}) {
                this.PaLM = PaLM;
                this.config = this.PaLM.#parseConfig(rawConfig, {
                    context: "",
                    messages: [],
                    examples: [],
                })
                this.messages = this.config.messages;
            }

            async ask(message, rawConfig) {
                let config = this.PaLM.#parseConfig(rawConfig, {
                    temperature: 0.5,
                    candidate_count: 1,
                    top_p: 0.95,
                    top_k: 40,
                    model: "chat-bison-001",
                    max_output_tokens: 1024,
                    format: PaLM.FORMATS.MD
                })

                let response = await this.PaLM.#query(config.model, "generateMessage", {
                    "prompt": {
                        "context": this.config.context, "messages": [...this.messages, { "content": message }], "examples": this.config.examples.map(x => ({
                            input: { content: x[0] },
                            output: { content: x[1] },
                        }))
                    },
                    candidate_count: config.candidate_count,
                    temperature: config.temperature,
                    top_p: config.top_p,
                    top_k: config.top_k,
                })
                if (!response.candidates[0].content) {
                    throw new Error(`Request rejecteted. Got ${response.at(-1)} instead of response.`)
                }
                this.messages.push({ content: message });
                this.messages.push({ content: response.candidates[0].content });
                switch (config.format) {
                    case PaLM.FORMATS.MD:
                        return response.candidates[0].content
                    case PaLM.FORMATS.JSON:
                        return response;
                    default:
                        throw new Error(`${config.format} is not a valid format. Use PaLM.FORMATS.MD or PaLM.FORMATS.JSON.`)
                }
            }
        }

        return (new Chat(this, rawConfig))
    }
}

export default PaLM;
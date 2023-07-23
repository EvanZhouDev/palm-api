<picture>

  <source media="(prefers-color-scheme: dark)" srcset="./assets/banner@dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="./assets/banner@light.svg">
  <img alt="PaLM API Banner" src="./assets/banner@light.svg">
</picture>
<p align="center">
  <a href="#documentation">Docs</a> | <a href="https://github.com/evanzhoudev/palm-api">GitHub</a> | <a href="#frequently-asked-questions">FAQ</a>
</p>

## Features

- 🤖 [**Multi-Model Support**](#documentation): Use any model available for PaLM
- 🌐 [**Contextual Conversations**](#palmcreatechat): Chat with PaLM with ease
- 🧪 [**Easy Parameter Tweaking**](#config-1): Easily modify `temperature`, `top_p`, and more

### Highlights

Compared to Google's [own API](#why-palm-api):

- ⚡ **Fast**[^1]: As fast as native API (also making it _**4x**_ faster than `googlebard`)
- 🪶 **Lightweight**[^2]: _**260x**_ smaller minzipped size
- 🚀 [**Simple & Easy**](#why-palm-api): _**2.8x**_ less code needed

[^1]: Tested with `hyperfine` with the demo code on [Google's own website](https://developers.generativeai.google/tutorials/chat_node_quickstart#generate_messages), and equivalent code written in PaLM API, the times are virtually similar.
[^2]:
    _PaLM API_ clocks in at 1.3kb minzipped.
    [@google/generativelanguage](https://www.npmjs.com/package/@google-ai/generativelanguage) and [google-auth-library](https://www.npmjs.com/package/google-auth-library), the two required packages for Google's own implementation, clocks in at a total (more or less) of [337kb minzipped](https://bundlephobia.com/scan-results?packages=@google-ai/generativelanguage@0.2.1,google-auth-library@9.0.0).
    That makes PaLM API around 260 times smaller!

## Table of Contents

- [Why PaLM API?](#why-palm-api)
- [Documentation](#documentation)
  - [Setup](#setup): Getting Started
  - [`PaLM.ask()`](#palmask): The best way to use PaLM
  - [`PaLM.generateText()`](#palmgeneratetext): Use `generateText` models
  - [`PaLM.embed()`](#palmembed): Embed text with PaLM
  - [`PaLM.createChat()`](#palmcreatechat): Continue conversations easily.

## Why PaLM API?

Google has its own API interface for PaLM, though their [@google/generativelanguage](https://www.npmjs.com/package/@google-ai/generativelanguage) and [google-auth-library](https://www.npmjs.com/package/google-auth-library) packages .

However, making requests with the native package is simply too complicated, clunky, and slow.

Here's the code you need for the Google API to ask PaLM something with context:

```javascript
const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const client = new DiscussServiceClient({
	authClient: new GoogleAuth().fromAPIKey(process.env.API_KEY),
});

const result = await client.generateMessage({
	model: "models/chat-bison-001",
	prompt: {
		context: "Respond to all questions with a single number.",
		messages: [{ content: "How tall is the Eiffel Tower?" }],
	},
});

console.log(result[0].candidates[0].content);
```

And here's the equivalent code in `palm-api`:

```javascript
import PaLM from "palm-api";

let bot = new PaLM(process.env.API_KEY);

bot.ask("How tall is the Eiffel Tower?", {
	context: "Respond to all questions with a single number.",
});
```

Yep! That's it... get the best features of PaLM, in a package that's simpler and easier to use, test, and maintain.

## Documentation

### Setup

First, install PaLM API on NPM:

```bash
npm install palm-api
```

or PNPM:

```bash
pnpm add palm-api
```

Then, get yourself an API key in Makersuite [here](https://makersuite.google.com/app/apikey).
Click on "Create API key in new project," and then simply copy the string.

Import PaLM API, then initialize the class with your API key.

> [!WARNING]\
> It is recommended that you access your API from `process.env` or `.env`

```javascript
import PaLM from "palm-api";

let bot = new PaLM(API_KEY, { ...config });
```

#### Config

| Config | Type     | Description                                                    |
| ------ | -------- | -------------------------------------------------------------- |
| fetch  | function | Fetch polyfill with _same interface as native fetch_. Optional |

> [!NOTE]\
> PaLM itself and all of its methods have a `config` object that you can pass in as a secondary parameter.
> Example:
>
> ```javascript
> import PaLM from "palm-api";
> import fetch from "node-fetch";
> let bot = new PaLM(API_KEY, {
> 	fetch: fetch,
> });
> ```

### `PaLM.ask()`

Uses the `generateMessage` capable models to provide a high-quality LLM experience, with context, examples, and more.

**Models available:** `chat-bison-001`

#### Usage:

```javascript
PaLM.ask(message, { ...config });
```

#### Config:

Learn more about model parameters [here](https://developers.generativeai.google/guide/concepts#model_parameters).
| Config | Type | Description |
| ----------------- | ------------------------------------------ | ------------------------------------------------------------------ |
| `model` | string | Any model capable of `generateMessage`. Default: `chat-bison-001`. |
| `candidate_count` | integer | How many responses to generate. Default: `1` |
| `temperature` | float | Temperature of model. Default: `0.7` |
| `top_p` | float | top_p of model. Default: `0.95` |
| `top_k` | float | top_k of model. Default: `40` |
| `format` | `PaLM.FORMATS.MD` or `PaLM.FORMATS.JSON` | Return as JSON or Markdown. Default: `PaLM.FORMATS.MD` |
| `context` | string | Add context to your query. Optional |
| `examples` | array of `[example_input, example_output]` | Show PaLM how to respond. See examples below. Optional. |

#### Example:

```javascript
import PaLM from "palm-api";

let bot = new PaLM(API_KEY);

bot.ask("x^2+2x+1", {
	temperature: 0.5,
	candidateCount: 1,
	context: "Simplify the expression",
	examples: [
		["x^2-4", "(x-2)(x+2)"],
		["2x+2", "2(x+1)"],
		// ... etc
	],
});
```

#### JSON Response:

```javascript
[
	{ content: string }, // Your message
	{ content: string }, // AI response
	// And so on in such pairs...
];
```

### `PaLM.generateText()`

Uses the `generateText` capable models to let PaLM generate text.

**Models available:** `text-bison-001`

#### API:

```javascript
PaLM.generateText(message, { ...config });
```

#### Config:

Learn more about model parameters [here](https://developers.generativeai.google/guide/concepts#model_parameters).
| Config | Type | Description |
| ----------------- | ---------------------------------------- | --------------------------------------------------------------- |
| `model` | string | Any model capable of `generateText`. Default: `text-bison-001`. |
| `candidate_count` | integer | How many responses to generate. Default: `1` |
| `temperature` | float | Temperature of model. Default: `0` |
| `top_p` | float | top_p of model. Default: `0.95` |
| `top_k` | float | top_k of model. Default: `40` |
| `format` | `PaLM.FORMATS.MD` or `PaLM.FORMATS.JSON` | Return as JSON or Markdown. Default: `PaLM.FORMATS.MD` |

#### Example:

```javascript
import PaLM from "palm-api";

let bot = new PaLM(API_KEY);

bot.generateText("Write a poem on puppies.", {
	temperature: 0.5,
	candidateCount: 1,
});
```

#### JSON Response:

See more about safety ratings [here](https://developers.generativeai.google/api/rest/generativelanguage/models/generateText#harmcategory).

```javascript
[
	{
		output: output,
		safetyRatings: [
			HARM_CATEGORY_UNSPECIFIED: rating,
			HARM_CATEGORY_DEROGATORY: rating,
			HARM_CATEGORY_TOXICITY: rating,
			HARM_CATEGORY_VIOLENCE: rating,
			HARM_CATEGORY_SEXUAL: rating,
			HARM_CATEGORY_DANGEROUS: rating,
		]
	},
	// More candidates (if asked for)...
];
```

### `PaLM.embed()`

Uses PaLM to embed your text into a float matrix with `embedText` enabled models, that you can use for various complex tasks.

**Models available:** `embedding-gecko-001`

#### Usage:

```javascript
PaLM.embed(message, { ...config });
```

#### Config:

| Config  | Type   | Description                                                          |
| ------- | ------ | -------------------------------------------------------------------- |
| `model` | string | Any model capable of `generateText`. Default: `embedding-gecko-001`. |

#### Example:

```javascript
import PaLM from "palm-api";

let bot = new PaLM(API_KEY);

bot.embed("Hello, world!", {
	model: "embedding-gecko-001",
});
```

#### JSON Response:

```javascript
[...embeddingMatrix];
```

### `PaLM.createChat()`

Uses `generateMessage` capable models to create a chat interface that's simple, fast, and easy to use.

### Usage:

```javascript
let chat = PaLM.createChat({ ...config });

chat.ask(message, { ...config });

chat.export();
```

The `ask` method on Chat remembers previous messages and responses, so you can have a continued conversation.

Basic steps to use import/export chats:

1. Create an instance of Chat with `PaLM.createChat()`
2. Use `Chat.ask()` to query PaLM
3. Use `Chat.export()` to export your messsages and PaLM responses
4. Import your messages with the messages config with `PaLM.createChat({messages: exportedMessages})`

> **Info**
> You can actually change the messages exported, and PaLM in your new chat instance will adapt to the "edited history." Use this to your advantage!

#### Config for `createChat()`:

Learn more about model parameters [here](https://developers.generativeai.google/guide/concepts#model_parameters).
All configuration associated with `Chat.ask()` _except_ the `format` is set in the config for `createChat()`.

| Config            | Type                                       | Description                                                        |
| ----------------- | ------------------------------------------ | ------------------------------------------------------------------ |
| `messages`        | array                                      | Exported messages from previous Chats. Optional.                   |
| `model`           | string                                     | Any model capable of `generateMessage`. Default: `chat-bison-001`. |
| `candidate_count` | integer                                    | How many responses to generate. Default: `1`                       |
| `temperature`     | float                                      | Temperature of model. Default: `0.7`                               |
| `top_p`           | float                                      | top_p of model. Default: `0.95`                                    |
| `top_k`           | float                                      | top_k of model. Default: `40`                                      |
| `context`         | string                                     | Add context to your query. Optional                                |
| `examples`        | array of `[example_input, example_output]` | Show PaLM how to respond. See examples below. Optional.            |

#### Config for `Chat.ask()`:

| Config   | Type                                     | Description                                            |
| -------- | ---------------------------------------- | ------------------------------------------------------ |
| `format` | `PaLM.FORMATS.MD` or `PaLM.FORMATS.JSON` | Return as JSON or Markdown. Default: `PaLM.FORMATS.MD` |

#### Example:

```javascript
import PaLM from "palm-api";

let bot = new PaLM(API_KEY);

let chat = PaLM.createChat({
	temperature: 0,
	context: "Respond like Shakespeare",
});

chat.ask("What is 1+1?");
chat.ask("What do you get if you add 1 to that?");
```

The response for `Chat.ask()` is exactly the same as `PaLM.ask()`. In fact,they use the same query function under-the-hood.

## Frequently Asked Questions

### "Why can the model not access the internet like Bard?"

PaLM is only a Language Model. Google Bard is able to search the Internet because it is performing additional searches on Google, and feeding the results back into PaLM. Thus, if you do want to mimic the web-search behavior, you need to implement it yourself. (Or just use [`bard-ai`](https://github.com/evanzhoudev/bard-ai) for a _Google Bard_ API!)

### "`fetch` is undefined" or "I can't use default `fetch`"

PaLM API uses the experimental `fetch` function in Node.js. It is enabled by default now, but there are still environments in which it is `undefined`, or disabled. You may also be here because you need to use a special fetch for your development environment. Because of this, PaLM API comes with a way to Polyfill fetch—built in. Just pass in your custom `fetch` function into the config for the PaLM class.

```javascript
import PaLM from "palm-api";
import fetch from "node-fetch";

let bot = new PaLM(API_KEY, {
	fetch: fetch,
});
```

It's that easy! Just ensure your polyfill has the exact same API as the default Node.js/browser `fetch` or it is not guarenteed to work.

### "Cannot `require` of a ES6 module"

PaLM API, as per today's standards, is a strictly ES6 module (that means it uses the new `import`/`export` syntax). Because of this, you have two options if you are still using `require`/CommonJS Modules:

1. Migrate to ESM yourself! It will be beneficial for you in the future.
2. Use a [dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import).

<h2 align="center">Contributors</h2>
<p align="center">A special shoutout to developers and contributors of the <a href="https://github.com/EvanZhouDev/bard-ai"><code>bard-ai</code></a> library. The PaLM API interface is basically an exact port of the <a href="https://github.com/EvanZhouDev/bard-ai"><code>bard-ai</code></a> interface.</p>
<p align="center">
  However, we thank every person that helps in the development process of this library, no matter that be in code, ideas, or anything else.
</p>

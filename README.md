<h1 align="center">PaLM API</h1>
<p align="center">Faster. Easier. Smarter.</p>

## Features

- 🤖 [**Multi-Model Support**](https://github.com/EvanZhouDev/palm-api#setup): Use any model available for PaLM
- 🌐 [**Contextual Conversations**](https://github.com/EvanZhouDev/palm-api#palmcreatechat): Chat with PaLM with ease
- 🧪 [**Easy Parameter Tweaking**](https://github.com/EvanZhouDev/palm-api#config-1): Easily modify `temperature`, `top_p`, and more

### Highlights

Compared to Google's [own API](https://github.com/EvanZhouDev/palm-api#why-palm-api):

- ⚡ **Fast**[^1]: As fast as native API (also making it _**4x**_ faster than `googlebard`)
- 🪶 **Lightweight**[^2]: _**260x**_ smaller minzipped size
- 🚀 [**Simple & Easy**](https://github.com/EvanZhouDev/palm-api#why-palm-api): _**2.8x**_ less code needed

[^1]: Tested with `hyperfine` with the demo code on [Google's own website](https://developers.generativeai.google/tutorials/chat_node_quickstart#generate_messages), and equivalent code written in PaLM API, the times are virtually similar.
[^2]:
    _PaLM API_ clocks in at 1.3kb minzipped.
    [@google/generativelanguage](https://www.npmjs.com/package/@google-ai/generativelanguage) and [google-auth-library](https://www.npmjs.com/package/google-auth-library), the two required packages for Google's own implementation, clocks in at a total (more or less) of [337kb minzipped](https://bundlephobia.com/scan-results?packages=@google-ai/generativelanguage@0.2.1,google-auth-library@9.0.0).
    That makes PaLM API around 260 times smaller!

## Get Started on GitHub:

- [Why PaLM API?](#why-palm-api)
- [Documentation](#documentation)
  - [Setup](#setup): Getting Started
  - [`PaLM.ask()`](#palmask): The best way to use PaLM
  - [`PaLM.generateText()`](#palmgeneratetext): Use `generateText` models
  - [`PaLM.embed()`](#palmembed): Embed text with PaLM
  - [`PaLM.createChat()`](#palmcreatechat): Continue conversations easily.

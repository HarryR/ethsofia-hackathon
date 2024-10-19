# Block quAIz / Private AI Questionnaires
![logo](https://github.com/user-attachments/assets/f8489f23-9391-4099-a979-bb52c626d739)

[View Presentation](https://docs.google.com/presentation/d/1twz7TiH-kKm2Gt0SAwlKOJ6Rm382GNb-l1UYOKEFV18/edit?usp=sharing)

**Powered by iExec**

The AI powered questionnaires app lets you create and fill out questionnaires. Your responses are interpreted by AI (a LLM).

Questionnaires can be customized (via the `nft/tasks/makeq.ts` script, see `nft/q/1.json` for an example), and can include extra prompts only seen by the AI.

With iExec we are using confidential workers and Data Protect, so your responses are submitted privately, the iExec worker then runs the AI on your responses in private, and generates the result.

The result is public, so anybody can see what the AI thinks, but they won't see what you responded with.

Example transaction: https://blockscout.bellecour.iex.ec//tx/0xffcd61e77e727354588e85275808bc6e7d4ae13f91ac6e8446cbdc42019faf3f

### Tech Used:

 * pnpm
 * TypeScript
 * VueJS
 * Solidity
 * [wllama](https://github.com/ngxson/wllama) (WebAssembly binding for llama.cpp)
 * [iExec](https://www.iex.ec/) - off-chain compute layer
 * [Scone Framework](https://scontain.com/) - Docker containers inside SGX
 * LLM: [Qwen2.5 0.5B](https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF)

### Questionnaire Format

There can be several types of questions, info to be shown to the user, and prompts to be included.

```json
{
    "title": "Basic Health Check",
    "questions": [
        ["", "prompt", "I am medical AI, here are my questions"],
        ["Please fill out this health questions", "info"],
        ["What is your age?", "number"],
        ["How many cigarettes per day?", "range", "[0,100]"],
        ["What is your sex?", "select", "[\"male\", \"female\", \"other\"]"],
        ["When did your symptoms first appear?", "select", "[\"Today\",\"This Week\", \"This Month\", \"This Year\", \"Longer than 1 year\"]"],
        ["Please describe your problem", "string"],
        ["", "prompt", "Please provide a brief response"]
    ]
}
```

Question types:

 * range
 * select
 * number
 * string (free text)

Your responses to the questionnaire is converted into a prompt, it includes the `prompt` fields above (but not the `info`) and gives the LLM a list of your responses. For example:

```
I am medical AI, here are my questions

 * What is your age?: 3
 * How many cigarettes per day?: 0
 * What is your sex?: male
 * When did your symptoms first appear?: Today
 * Please describe your problem: Problem

Please provide a brief response
```

### Problems

 * We couldn't get AI working inside the confidential worker, this is a problem with iExec & Scone only supporting Node 14 (ancient). Instead we're running the LLM in the browser with WASM as a workaround. [Read more](./packages/backend/README.md)

# AI Powered Questionnaires

**Powered by iExec**

The AI powered questionnaires app lets you create and fill out questionnaires. Your responses are interpreted by AI (a LLM).

Questionnaires can be customized (via the `nft/tasks/makeq.ts` script, see `nft/q/1.json` for an example), and can include extra prompts only seen by the AI.

With iExec we are using confidential workers and Data Protect, so your responses are submitted privately, the iExec worker then runs the AI on your responses in private, and generates the result.

The result is public, so anybody can see what the AI thinks, but they won't see what you responded with.

Example transaction: https://blockscout.bellecour.iex.ec//tx/0xffcd61e77e727354588e85275808bc6e7d4ae13f91ac6e8446cbdc42019faf3f

### Problems

 * We couldn't get AI working inside the confidential worker, this is a problem with iExec & Scone only supporting Node 14 (ancient). Instead we're running the LLM in the browser with WASM as a workaround.

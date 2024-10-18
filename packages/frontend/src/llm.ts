import { AssetsPathConfig, Wllama } from '@wllama/wllama'

import singleThreadJs from '@wllama/wllama/esm/single-thread/wllama.js?url'
import singleThreadWasm from '@wllama/wllama/esm/single-thread/wllama.wasm?url'
import multiThreadJs from '@wllama/wllama/esm/multi-thread/wllama.js?url'
import multiThreadWasm from '@wllama/wllama/esm/multi-thread/wllama.wasm?url'
import multiThreadWorkerJs from '@wllama/wllama/esm/multi-thread/wllama.worker.mjs?url'

const WllamaPaths: AssetsPathConfig = {
    "single-thread/wllama.js": singleThreadJs,
    "single-thread/wllama.wasm": singleThreadWasm,
    "multi-thread/wllama.js": multiThreadJs,
    "multi-thread/wllama.wasm": multiThreadWasm,
    "multi-thread/wllama.worker.mjs": multiThreadWorkerJs,
}

const modelUrl = "https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf"

export async function evaluatePrompt(prompt :string) {
    let wllama: Wllama = new Wllama(WllamaPaths);

    await wllama.loadModelFromUrl(modelUrl);
    let result = await wllama.createCompletion(prompt, {
        nPredict: 300
    });

    return result;
}

eval('window.evaluatePromptDebug = evaluatePrompt;')


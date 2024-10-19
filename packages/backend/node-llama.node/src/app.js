const fsPromises = require('fs').promises;
const path = require('path');
const util = require('util');
const {
  IExecDataProtectorDeserializer,
} = require('@iexec/dataprotector-deserializer');

//const modelUrl = 'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf'
const modelPath = path.join(__dirname, './qwen2.5-0.5b-instruct-q4_k_m.gguf')

const main = async () => {
  //const modelPath = process.env.IEXEC_INPUT_FILE_NAME_1
  const llama = await import('@fugood/llama.node')
  
  try {
    const output = process.env.IEXEC_OUT;
    const message =
      process.argv.length > 2 && process.argv[2] !== 'undefined'
        ? process.argv[2]
        : 'World';

    console.log('Args', process.argv.slice(2));

    let file;
    let prompt = process.argv.slice(2).join(' ') || 'Hello hello!';
    try {
      const deserializer = new IExecDataProtectorDeserializer();
      file = await deserializer.getValue('email', 'string');
    } catch (e) {
      file = 'missing protectedData';
      console.log('It seems there is an issue with your protectedData :', e);
    }

    const context = await llama.loadModel({
      model: modelPath,
      n_ctx: 1024,
    })
    const { text } = await context.completion(
      {
        prompt,
        n_predict: 200,
        stop: ['</s>'],
        // n_threads: 4,
      },
      (data) => {},
    )

    // Append some results in /iexec_out/
    const combinedContent = `Your ProtectedData content: ${file}\n`;
    await fsPromises.writeFile(`${output}/result.txt`, combinedContent);
    await fsPromises.writeFile(`${output}/airesult.txt`, text);
    // Declare everything is computed
    const computedJsonObj = {
      'deterministic-output-path': `${output}/result.txt`,
    };
    await fsPromises.writeFile(
      `${output}/computed.json`,
      JSON.stringify(computedJsonObj)
    );
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

main();

const fsPromises = require('fs').promises;
const path = require('path');
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const {
  IExecDataProtectorDeserializer,
} = require('@iexec/dataprotector-deserializer');

const model = path.join(__dirname, 'qwen2.5-0.5b-instruct-q4_k_m.gguf')
const llamaexec = path.join(__dirname, 'llamafile')
const llamaparams = [
  '-m', model,
  '--cli',
  '-n', '100',
  '-p',
]

const main = async () => {
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

    const result = await execFile(llamaexec, llamaparams.concat([prompt]))

    // Append some results in /iexec_out/
    const combinedContent = `Your ProtectedData content: ${file}\n You AI fortune: ${result.stdout}`;
    await fsPromises.writeFile(`${output}/result.txt`, combinedContent);
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

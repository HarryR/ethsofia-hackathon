require('core-js/actual')
const fsPromises = require('fs').promises;
const {
  IExecDataProtectorDeserializer,
} = require('@iexec/dataprotector-deserializer');

const main = async () => {
  const {
    default: fetch,
    Blob,
    blobFrom,
    blobFromSync,
    File,
    fileFrom,
    fileFromSync,
    FormData,
    Headers,
    Request,
    Response,
  } = await import('node-fetch')

  if (!globalThis.fetch) {
    globalThis.fetch = fetch
    globalThis.Headers = Headers
    globalThis.Request = Request
    globalThis.Response = Response
  }

  //const { pipeline, env } = await import('@xenova/transformers')

  global.self = {}
  require('../vendor/transformers.js')
  const {pipeline, env} = transformers_HACK

  try {
    const output = process.env.IEXEC_OUT;
    const message =
      process.argv.length > 2 && process.argv[2] !== 'undefined'
        ? process.argv[2]
        : 'World';
    console.log('Args', process.argv.slice(2));

    let file;
    let aiInput = process.argv.slice(2).join(' ') || 'Hello hello!';
    try {
      const deserializer = new IExecDataProtectorDeserializer();
      file = await deserializer.getValue('email', 'string');
    } catch (e) {
      file = 'missing protectedData';
      console.log('It seems there is an issue with your protectedData :', e);
    }

    let instance = await pipeline('sentiment-analysis', 'Xenova/bert-base-multilingual-uncased-sentiment')
    let aiOutput = await instance(aiInput)

    main();

    // Append some results in /iexec_out/
    const combinedContent = `Your ProtectedData content: ${file}\n You AI fortune: ${JSON.stringify(aiOutput)}`;
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

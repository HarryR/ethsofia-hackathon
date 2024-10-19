const fsPromises = require('fs').promises;
const figlet = require('figlet');
const {
  IExecDataProtectorDeserializer,
} = require('@iexec/dataprotector-deserializer');

const main = async () => {
  try {
    const output = process.env.IEXEC_OUT;
    const message =
      process.argv.length > 2 && process.argv[2] !== 'undefined'
        ? process.argv[2]
        : 'World';

    const text = figlet.textSync(`Hello, ${message}!`);

    let file;
    try {
      const deserializer = new IExecDataProtectorDeserializer();
      file = await deserializer.getValue('email', 'string');
    } catch (e) {
      file = 'missing protectedData';
      console.log('It seems there is an issue with your protectedData :', e);
    }

    // Append some results in /iexec_out/
    const combinedContent = `${text}\n Your ProtectedData content: ${file}`;
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

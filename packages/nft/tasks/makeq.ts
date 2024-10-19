import { task } from 'hardhat/config';
import { promises as fs } from 'fs';
import { LLMQuestion } from '../src/contracts';

interface MakeQArgs {
    input: string;
}

task('makeq')
    .addParam('input', 'Questions file (json)')
    .setAction(async (args:MakeQArgs, hre) => {
        const contract = await hre.ethers.getContractAt('LLMQuestion', '0x3790add8f936F5066515fA60B63F1069bB58ED10');

        const input = JSON.parse(new TextDecoder().decode(await fs.readFile(args.input)));
        const questions = input.questions.map((_:any) => {
            if( _.length == 3 ) {
                return [_[0], _[1], JSON.stringify(_[2])];
            }
            else {
                return [_[0], _[1], ''];
            }
        });
        const qs = {
            owner: (await hre.ethers.getSigners())[0].address,
            title: input.title,
            questions
        } as LLMQuestion.QuestionnaireStruct;
        console.log('Questoins', qs);
        const tx = await contract.create(qs);
        console.log('tx', tx);
        const receipt = await tx.wait()
        console.log('receipt', receipt);

        const titles = await contract.getList();
        console.log(titles);
    });

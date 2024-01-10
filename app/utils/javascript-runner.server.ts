import {Script} from '@prisma/client';
import util from 'node:util';
import {isBuiltin} from 'node:module';
import {writeFile} from 'fs/promises';
import {exec as defaultExec} from 'child_process';
import {exportRequires} from './extract-require';
import {getVMScript} from './vm.server';
import {getTask} from './task.server';

const exec = util.promisify(defaultExec);

export const runProject = async (task: Awaited<ReturnType<typeof getTask>>) => {
  const id = task?.id;
  const scripts = task?.scripts as Script[];
  const [index] = scripts;

  try {
    const appDir = `/tmp/${id}`;
    console.log('Create project folder', appDir);

    await exec(`mkdir -p ${appDir} && cd ${appDir} && npm init -y`);

    console.log('Write script.js');

    await writeFile(`${appDir}/script.js`, index.code);

    console.log('Install dependencies');
    const {requires} = exportRequires(index.code);
    const dependencies = requires.filter(module => !isBuiltin(module));

    await exec(`cd ${appDir} && pnpm add ${dependencies.join(' ')}`);

    const scriptTemplate = getVMScript();

    console.log('Write index.js');
    await writeFile(`${appDir}/index.js`, scriptTemplate);

    console.log('Run script');
    const {stderr, stdout} = await exec(
      `cd ${appDir} && npx --yes tsx index.js`,
    );

    console.log('stderr', stderr);
    console.log('stdout', stdout);
  } catch (error) {
    console.error('Error when running project', error);
  }
};

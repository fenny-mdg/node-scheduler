import {ActionFunctionArgs} from '@remix-run/node';
import {redirectBack} from 'remix-utils/redirect-back';

import {getTask} from '~/utils/task.server';
import {runProject} from '~/utils/javascript-runner.server';

export const action = async ({request}: ActionFunctionArgs) => {
  const formData = await request.formData();
  console.log('extract', formData.get('taskId'));

  const task = await getTask(formData.get('taskId') as string);

  // console.log('task', task);
  const script = task?.scripts[0];

  if (script) {
    // const {requires} = exportRequires(script.code);

    // console.log(
    //   'requires',
    //   requires.filter(module => !isBuiltin(module)),
    // );

    await runProject(task);
    return redirectBack(request, {fallback: '/app/tasks'});
  }
};

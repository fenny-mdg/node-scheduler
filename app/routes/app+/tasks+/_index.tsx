import {TaskItem} from '@/components/task/task-item';
import {LoaderFunctionArgs, json} from '@remix-run/node';
import {useLoaderData} from '@remix-run/react';
import {getTasks} from '~/utils/task.server';

export const loader = async ({}: LoaderFunctionArgs) => {
  const tasks = await getTasks();

  return json({tasks});
};

export default function TasksIndex() {
  const loaderData = useLoaderData<typeof loader>();
  const tasks = loaderData?.tasks;

  return (
    <div>
      <div>Tasks Index</div>

      <div>
        {tasks?.map(task => (
          <TaskItem
            id={task.id}
            key={task.id}
            name={task.name}
            description={task.description ?? ''}
            lastExcecutionDate=""
            createdDate={task.createdAt}
            lastUpdated={task.updatedAt}
          />
        ))}
      </div>
    </div>
  );
}

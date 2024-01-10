import {Field, TextareaField} from '@/components/ui/forms';
import {conform, useForm} from '@conform-to/react';
import {getFieldsetConstraint, parse} from '@conform-to/zod';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/node';
import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {getTask} from '~/utils/task.server';
import {TaskSchema} from './new';
import {Button} from '@/components/ui/button';

export const loader = async ({params}: LoaderFunctionArgs) => {
  const {id} = params;
  const task = await getTask(id!);

  if (!task) {
    throw new Error('Task not found');
  }

  return json({task});
};
// export const action = async ({request}: ActionFunctionArgs) => {
//   return redirect('/app/tasks');
// };

export default function TasksDetail() {
  const loaderData = useLoaderData<typeof loader>();
  // const actionData = useActionData<typeof action>();
  const task = loaderData?.task;

  const [form, fields] = useForm({
    id: 'assessment-form',
    constraint: getFieldsetConstraint(TaskSchema),
    // lastSubmission: actionData?.submission,
    onValidate({formData}) {
      return parse(formData, {schema: TaskSchema});
    },
    shouldRevalidate: 'onBlur',
    defaultValue: {
      name: task.name,
      description: task.description,
      code: task.scripts[0].code,
      // fileName: z.string().optional(),
      // language: z.string().optional(),
    },
  });

  return (
    <div>
      <div>{task.name}</div>
      <Form method="POST" action="./extract">
        <input type="hidden" name="taskId" value={task.id} />
        <Button>Extract</Button>
      </Form>
      <Form method="POST" {...form.props}>
        <Field
          inputProps={conform.input(fields.name)}
          labelProps={{children: 'Nom'}}
        />
        <TextareaField
          labelProps={{children: 'Description'}}
          textareaProps={conform.textarea(fields.description)}
        />

        <TextareaField
          labelProps={{children: ''}}
          textareaProps={{
            ...conform.textarea(fields.code),
            placeholder: 'Write a tagline for an ice cream shop',
            rows: 20,
          }}
          // className="min-h-[400px] flex-1 md:min-h-[700px] lg:min-h-[700px]"
        />
        <Button>Submit</Button>
      </Form>
    </div>
  );
}

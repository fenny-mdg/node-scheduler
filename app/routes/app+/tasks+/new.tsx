import {Form, useActionData} from '@remix-run/react';
import {z} from 'zod';
import {conform, useForm} from '@conform-to/react';
import {getFieldsetConstraint, parse} from '@conform-to/zod';
import {json, type ActionFunctionArgs, redirect} from '@remix-run/node';

import {Button} from '@/components/ui/button';
import {Field, TextareaField} from '@/components/ui/forms';
import {createTaskWithScript} from '~/utils/task.server';

export const TaskSchema = z.object({
  name: z.string(),
  description: z.string(),
  code: z.string(),
  fileName: z.string().optional(),
  language: z.string().optional(),
});

export const action = async ({request}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const submission = await parse(formData, {
    schema: intent =>
      TaskSchema.transform(async (data, ctx) => {
        if (intent !== 'submit') return {...data};

        const {
          code,
          description,
          name,
          language = 'javascript',
          fileName = 'index.js',
        } = data;

        await createTaskWithScript({
          code,
          description,
          name,
          fileName,
          language,
          ownerId: '',
        });
        // const {email, fullName, phone, zipCode, ...assessmentData} = data;
        // const concernedUser = await createOrUpdateConcernedUser({
        //   email,
        //   fullName,
        //   phone,
        //   zipCode,
        // });
        // const assessment = await createAssessment({
        //   ...(assessmentData as any),
        //   concernedUserId: concernedUser.id,
        // });

        return {...data};
      }),
    async: true,
  });

  if (submission.intent !== 'submit') {
    return json({status: 'idle', submission} as const);
  }

  return redirect('../');
};

export default function TasksNew() {
  const actionData = useActionData<typeof action>();

  const [form, fields] = useForm({
    id: 'assessment-form',
    constraint: getFieldsetConstraint(TaskSchema),
    lastSubmission: actionData?.submission,
    onValidate({formData}) {
      return parse(formData, {schema: TaskSchema});
    },
    shouldRevalidate: 'onBlur',
  });
  return (
    <div>
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

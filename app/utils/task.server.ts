import {Script, Task} from '@prisma/client';
import {prisma} from './db.server';

export const createTaskWithScript = (
  data: Pick<Task, 'description' | 'name' | 'ownerId'> &
    Pick<Script, 'code' | 'fileName' | 'language'>,
) => {
  const {code, fileName, ownerId, language, ...task} = data;
  return prisma.task.create({
    data: {
      ...task,
      ...(ownerId ? {owner: {connect: {id: ownerId}}} : {}),
      scripts: {
        create: [{code, fileName, language}],
      },
    },
  });
};

export const getTasks = () => {
  return prisma.task.findMany({
    // include: {scripts: true},
  });
};

export const getTask = (id: Task['id']) => {
  return prisma.task.findUnique({where: {id}, include: {scripts: true}});
};

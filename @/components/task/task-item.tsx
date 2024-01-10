import {Link} from '@remix-run/react';

type TaskItemProps = {
  id: string;
  name: string;
  createdDate: string;
  lastUpdated: string;
  lastExcecutionDate?: string;
  description?: string;
};

export function TaskItem({
  id,
  createdDate,
  name,
  description,
  lastUpdated,
  lastExcecutionDate,
}: TaskItemProps) {
  return (
    <Link to={`./${id}`}>
      <span>{name}</span>
      <div>
        <span>{createdDate}</span>
        <span>{lastUpdated}</span>
        <span>{lastExcecutionDate}</span>
      </div>
      <div>{description}</div>
    </Link>
  );
}

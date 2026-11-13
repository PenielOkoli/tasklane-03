export const taskStatuses = ['todo', 'doing', 'done'] as const;
export type TaskStatus = (typeof taskStatuses)[number];

export const taskPriorities = ['low', 'medium', 'high'] as const;
export type TaskPriority = (typeof taskPriorities)[number];

export const taskTags = ['design', 'engineering', 'research', 'content'] as const;
export type TaskTag = (typeof taskTags)[number];

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  tag: TaskTag;
}

export interface TaskFilters {
  query: string;
  priority: TaskPriority | 'all';
}

export const statusLabels: Record<TaskStatus, string> = {
  todo: 'To do',
  doing: 'In progress',
  done: 'Done',
};

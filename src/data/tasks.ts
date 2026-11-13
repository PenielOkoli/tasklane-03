import type { Task } from '@/types/task';

export const initialTasks: Task[] = [
  { id: 'tsk-research', title: 'Customer interview synthesis', description: 'Pull the key themes from discovery into one clear readout.', status: 'todo', priority: 'medium', tag: 'research' },
  { id: 'tsk-onboarding', title: 'Map the onboarding flow', description: 'Sketch a simpler path to the first useful moment.', status: 'todo', priority: 'high', tag: 'design' },
  { id: 'tsk-email', title: 'Draft launch announcement', description: 'Introduce the new experience and its main benefits.', status: 'todo', priority: 'low', tag: 'content' },
  { id: 'tsk-checkout', title: 'Build checkout prototype', description: 'Connect core screens and include loading and error states.', status: 'doing', priority: 'high', tag: 'engineering' },
  { id: 'tsk-mobile', title: 'Review mobile layouts', description: 'Check navigation and forms at small screen sizes.', status: 'doing', priority: 'medium', tag: 'design' },
  { id: 'tsk-tokens', title: 'Publish design tokens', description: 'Document shared colour, spacing, and type styles.', status: 'done', priority: 'low', tag: 'design' },
];

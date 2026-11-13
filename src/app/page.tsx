import { Board } from '@/components/board';
import { initialTasks } from '@/data/tasks';

export default function Home() {
  return <Board initialTasks={initialTasks} />;
}

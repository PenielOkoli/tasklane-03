'use client';

import { useMemo, useState } from 'react';
import { Check, Circle, Clock3, Flag, Search, Sparkles, MessageCircle } from 'lucide-react';
import { statusLabels, taskStatuses, type Task, type TaskPriority, type TaskStatus } from '@/types/task';

const priorityLabels: Record<TaskPriority, string> = { high: 'High', medium: 'Medium', low: 'Low' };

export function Board({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [query, setQuery] = useState('');
  const [priority, setPriority] = useState<TaskPriority | 'all'>('all');
  const visibleTasks = useMemo(() => tasks.filter(task =>
    `${task.title} ${task.description} ${task.tag}`.toLowerCase().includes(query.toLowerCase()) &&
    (priority === 'all' || task.priority === priority)), [tasks, query, priority]);
  const completed = tasks.filter(task => task.status === 'done').length;

  function moveTask(id: string, status: TaskStatus) {
    setTasks(current => current.map(task => task.id === id ? { ...task, status } : task));
  }

  return <><header className="topbar"><a className="brand" href="#main"><span className="brand-mark"><Check size={18}/></span>tasklane<span className="brand-dot">.</span></a><span className="workspace"><span className="online-dot"/>Personal workspace</span><a className="help-link" href="/copilot"><MessageCircle size={15}/> Assistant</a><a className="help-link" href="/guide">Architecture</a></header><main className="shell" id="main">
    <section className="intro"><div><p className="eyebrow">YOUR PROJECT, MOVING FORWARD</p><h1>A little help. A lot of momentum.</h1><p className="lede">A clear view of the work, with room for an AI copilot to grow.</p></div><aside className="project-chip"><span className="project-icon">⌘</span><span><b>Spring launch</b><small>Sample project · {tasks.length} tasks</small></span></aside></section>
    <section className="toolbar" aria-label="Board controls"><div className="tab active"><Check size={16}/> Board</div><span className="toolbar-spacer"/><span className="progress"><Check size={14}/>{completed} of {tasks.length} complete</span></section>
    <section className="controls"><label className="search"><Search size={17}/><span className="sr-only">Find tasks</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Find a task…"/></label><label className="priority-filter"><Flag size={15}/><span className="sr-only">Filter by priority</span><select value={priority} onChange={event => setPriority(event.target.value as TaskPriority | 'all')}><option value="all">All priorities</option><option value="high">High priority</option><option value="medium">Medium priority</option><option value="low">Low priority</option></select></label><div className="copilot-teaser"><Sparkles size={17}/><span>AI copilot</span><small>Coming in the next milestone</small></div></section>
    <section className="columns" aria-label="Project tasks">{taskStatuses.map(status => { const items = visibleTasks.filter(task => task.status === status); return <section className="column" key={status} aria-labelledby={`heading-${status}`}><header className="column-heading"><div><span className={`status-icon ${status}`}>{status === 'done' ? <Check size={14}/> : status === 'doing' ? <Clock3 size={14}/> : <Circle size={14}/>}</span><h2 id={`heading-${status}`}>{statusLabels[status]}</h2></div><span className="count">{items.length}</span></header>{items.length ? items.map(task => <article className="task-card" key={task.id}><div className="card-top"><span className={`tag ${task.tag}`}>{task.tag}</span><span className="task-ref">{task.id}</span></div><h3>{task.title}</h3><p>{task.description}</p><footer><span className={`priority ${task.priority}`}><i/> {priorityLabels[task.priority]}</span><label className="move"><span className="sr-only">Move {task.title}</span><select value={task.status} onChange={event => moveTask(task.id, event.target.value as TaskStatus)} aria-label={`Move ${task.title}`}><option value="todo">To do</option><option value="doing">In progress</option><option value="done">Done</option></select></label></footer></article>) : <p className="empty">No tasks here yet.</p>}</section>; })}</section>
    <footer className="footer"><span>Tasklane · Make room for meaningful work.</span><a href="/guide">How this app is built</a><span>FLEXISAF · DELIVERABLE 02</span></footer>
  </main></>;
}

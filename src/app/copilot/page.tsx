import { Chat } from '@/components/chat';
import '../chat.css';

export const metadata = { title: 'Tasklane Assistant — a clear path forward' };

export default function AssistantPage() {
  return <main className="chat-shell"><header className="chat-topbar"><a className="brand" href="/"><span className="brand-mark">✓</span>tasklane<span className="brand-dot">.</span></a><a href="/">← Back to board</a></header><Chat/></main>;
}

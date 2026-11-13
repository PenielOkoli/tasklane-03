'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Clipboard, Copy, MessageCircle, RotateCcw, Send, ShieldCheck, Sparkles, Square, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react';

type Role = 'user' | 'assistant';
type ChatMessage = { id: string; role: Role; text: string; state: 'complete' | 'stopped' | 'error'; feedback?: 'up' | 'down' };
const storageKey = 'tasklane-conversation-v1';
const suggestions = ['Help me break the launch into three clear next steps.', 'What should we focus on before launch?', 'Draft a short update for the project team.'];

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const controller = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { try { const saved = localStorage.getItem(storageKey); if (saved) setMessages(JSON.parse(saved) as ChatMessage[]); } catch { localStorage.removeItem(storageKey); } }, []);
  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(messages.slice(-40))); } catch { setStatus('Conversation could not be saved on this device.'); } }, [messages]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: streaming ? 'smooth' : 'auto', block: 'end' }); }, [messages, streaming]);

  async function send(text = draft, retry = false) {
    const prompt = text.trim();
    if (!prompt || streaming) return;
    setError(''); setDraft(''); setStreaming(true); setStatus('Tasklane is preparing a response.');
    const user: ChatMessage = { id: crypto.randomUUID(), role: 'user', text: prompt, state: 'complete' };
    const assistant: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', text: '', state: 'complete' };
    const base = retry ? messages.slice(0, -1) : messages;
    setMessages([...base, ...(retry ? [] : [user]), assistant]);
    const history = base.filter(item => item.state === 'complete' && item.text).slice(-8).map(({ role, text: content }) => ({ role, text: content }));
    controller.current = new AbortController();
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ prompt, history }), signal: controller.current.signal });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(typeof data.error === 'string' ? data.error : 'Tasklane could not reach its assistant. Your conversation is still here; retry when you are ready.');
      }
      if (!response.body) throw new Error('The assistant connection closed before it could respond. Retry when you are ready.');
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let answer = '';
      while (true) {
        const { value, done } = await reader.read(); if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages(current => current.map(item => item.id === assistant.id ? { ...item, text: answer } : item));
        setStatus('Tasklane is responding.');
      }
      answer += decoder.decode();
      if (!answer.trim()) throw new Error('The assistant returned an empty response. Please retry.');
      setMessages(current => current.map(item => item.id === assistant.id ? { ...item, text: answer.trim(), state: 'complete' } : item));
      setStatus('Response complete.');
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === 'AbortError') {
        setMessages(current => current.map(item => item.id === assistant.id ? { ...item, state: 'stopped' } : item));
        setStatus('Response stopped. Your partial answer is kept.');
      } else {
        const message = cause instanceof Error ? cause.message : 'The assistant is unavailable. Your conversation is still here.';
        setError(message);
        setMessages(current => current.map(item => item.id === assistant.id ? { ...item, state: 'error' } : item));
        setStatus('The response could not be completed.');
      }
    } finally { controller.current = null; setStreaming(false); }
  }

  function retryLast() {
    const lastUser = [...messages].reverse().find(item => item.role === 'user');
    if (lastUser) void send(lastUser.text, true);
  }
  function regenerate(message: ChatMessage) {
    const prior = messages.slice(0, messages.indexOf(message));
    const lastUser = [...prior].reverse().find(item => item.role === 'user');
    if (lastUser) { setMessages(prior); void send(lastUser.text, true); }
  }
  function stop() { controller.current?.abort(); }
  function clear() { if (streaming) return; setMessages([]); setError(''); setStatus('Conversation cleared from this device.'); localStorage.removeItem(storageKey); }
  async function copy(item: ChatMessage) { try { await navigator.clipboard.writeText(item.text); setCopied(item.id); setStatus('Message copied.'); window.setTimeout(() => setCopied(''), 1600); } catch { setError('Clipboard access is unavailable. Select and copy the message instead.'); } }
  function rate(id: string, feedback: 'up' | 'down') { setMessages(current => current.map(item => item.id === id ? { ...item, feedback } : item)); setStatus('Feedback saved on this device.'); }

  return <section className="chat-app" aria-labelledby="chat-title"><aside className="chat-aside"><div className="assistant-badge"><Sparkles size={20}/></div><p className="eyebrow">SPRING LAUNCH</p><h1>Think it through, together.</h1><p className="aside-copy">A calm space to turn a busy project into a clear next step.</p><div className="privacy-card"><ShieldCheck size={17}/><span><b>Your project space</b><small>This demo uses sample project context. Avoid confidential details.</small></span></div><a href="/guide" className="architecture-link">How the foundation works →</a></aside>
    <div className="conversation"><header className="conversation-head"><div><div className="assistant-name"><span className="avatar"><Sparkles size={16}/></span><span><b id="chat-title">Tasklane assistant</b><small><i/> Ready when you are</small></span></div></div><button className="icon-button" onClick={clear} disabled={streaming || messages.length === 0} aria-label="Clear conversation" title="Clear conversation"><Trash2 size={17}/></button></header>
      <div className="message-list" aria-label="Conversation">{messages.length === 0 ? <div className="welcome"><div className="welcome-icon"><MessageCircle size={22}/></div><p className="eyebrow">A LITTLE HELP. A LOT OF MOMENTUM.</p><h2>What’s on your mind?</h2><p>Ask about the Spring launch, shape a plan, or draft a quick update.</p><div className="suggestions">{suggestions.map(s => <button key={s} onClick={() => void send(s)} disabled={streaming}>{s}<span aria-hidden="true">↗</span></button>)}</div></div> : messages.map(item => <article key={item.id} className={`message ${item.role}`}><div className="message-avatar">{item.role === 'assistant' ? <Sparkles size={14}/> : 'Y'}</div><div className="message-body"><span className="message-author">{item.role === 'assistant' ? 'Tasklane' : 'You'}</span><div className="bubble">{item.text || (streaming ? <span className="typing"><i/><i/><i/><span className="sr-only">Tasklane is starting a response</span></span> : '')}{item.state === 'stopped' && <small className="message-note">Response stopped · partial answer kept</small>}{item.state === 'error' && <small className="message-note">Response incomplete</small>}</div>{item.role === 'assistant' && item.text && <div className="message-actions"><button onClick={() => void copy(item)} aria-label="Copy response">{copied === item.id ? <Check size={14}/> : <Copy size={14}/>}<span>{copied === item.id ? 'Copied' : 'Copy'}</span></button>{item.state === 'complete' && <button onClick={() => regenerate(item)} disabled={streaming}><RotateCcw size={14}/><span>Regenerate</span></button>}<button onClick={() => rate(item.id,'up')} aria-pressed={item.feedback === 'up'} aria-label="Helpful response"><ThumbsUp size={14}/></button><button onClick={() => rate(item.id,'down')} aria-pressed={item.feedback === 'down'} aria-label="Not helpful response"><ThumbsDown size={14}/></button></div>}</div></article>)}<div ref={endRef}/></div>
      <div className="composer-wrap">{error && <div className="chat-error" role="alert"><span>{error}</span><button onClick={retryLast} disabled={streaming}><RotateCcw size={14}/> Retry</button></div>}<form className="composer" onSubmit={event => { event.preventDefault(); void send(); }}><label className="sr-only" htmlFor="chat-input">Message Tasklane</label><textarea id="chat-input" ref={inputRef} value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void send(); } }} placeholder="Ask about your project…" rows={1} maxLength={2000} disabled={streaming}/><div className="composer-foot"><span>Enter to send · Shift + Enter for a new line</span>{streaming ? <button type="button" className="stop-button" onClick={stop}><Square size={14} fill="currentColor"/> Stop</button> : <button type="submit" className="send-button" disabled={!draft.trim()}><Send size={15}/> Send</button>}</div></form><p className="composer-note"><ShieldCheck size={12}/> AI can make mistakes. Review suggestions before acting on them.</p></div>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{status}</div></div></section>;
}

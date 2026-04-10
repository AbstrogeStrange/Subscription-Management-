import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { chatApi } from '../../api/api';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const QUICK_PROMPTS = [
  'Should I cancel Netflix?',
  'How can I save more money on subscriptions?',
  'Summarize my current subscription spending',
  'Which subscriptions should I downgrade first?',
];

const ChatsPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        setInsightsLoading(true);
        const response = await chatApi.getInsights();
        const insights: string[] = response.data.data || [];
        const insightMessages: ChatMessage[] = insights.map((item) => ({
          role: 'assistant',
          content: `Auto Insight: ${item}`,
        }));
        setMessages((prev) => [...prev, ...insightMessages]);
      } catch (error) {
        console.error('Failed to fetch chat insights:', error);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'I could not load insights right now, but I can still help with your subscription questions.',
          },
        ]);
      } finally {
        setInsightsLoading(false);
      }
    };

    loadInsights();
  }, []);

  const historyForApi = useMemo(
    () =>
      messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content })),
    [messages]
  );

  const sendMessage = async (message: string) => {
    const trimmed = message.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatApi.ask({
        message: trimmed,
        history: historyForApi.slice(-10),
      });
      const reply = response.data?.data?.reply || 'I could not generate a reply right now.';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (error: any) {
      const messageText =
        error?.response?.data?.message || 'Chat request failed. Please try again.';
      setMessages((prev) => [...prev, { role: 'assistant', content: messageText }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">Chats</h1>
        <p className="text-muted-foreground">
          Ask ChatGPT for subscription advice, spending analysis, and savings tips.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4 lg:col-span-1">
          <h2 className="mb-3 font-semibold text-foreground">Smart Prompts</h2>
          <div className="space-y-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="w-full rounded-xl border border-border px-3 py-2 text-left text-sm text-foreground transition hover:bg-accent"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 lg:col-span-3">
          <div className="mb-3 max-h-[52vh] space-y-3 overflow-y-auto pr-1">
            {insightsLoading ? (
              <p className="text-sm text-muted-foreground">Loading auto insights...</p>
            ) : null}
            {messages.length === 0 && !insightsLoading ? (
              <p className="text-sm text-muted-foreground">
                Start by asking: "How much can I save this month?"
              </p>
            ) : null}
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`max-w-[90%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.role === 'user'
                    ? 'ml-auto bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading ? <p className="text-sm text-muted-foreground">ChatGPT is thinking...</p> : null}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about canceling, saving, or analyzing expenses..."
              className="flex-1 rounded-xl border border-border bg-background px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-primary px-4 py-2.5 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;


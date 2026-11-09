import React, { useState } from 'react';
import { Sparkles, Send, X, Lightbulb, HelpCircle, Check, AlertCircle, RefreshCw, BookOpen, Bot, ShieldAlert } from 'lucide-react';
import { requestAIAssistant, AIRequestContext, AIResponse } from '../../services/aiAssistant';
import { AIMessage, QuizQuestion } from '../../types';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  context: AIRequestContext;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  context,
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Welcome to the **${context.experimentTitle}** assistant! I have access to your live telemetry and physical parameters. Ask questions, request hints, or click **"Interpret Results"** below.`,
      timestamp: Date.now(),
      source: 'offline',
      suggestedActions: [
        'Interpret my current results',
        'Request experimental hint',
        'Take a 3-question concept quiz',
      ],
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<QuizQuestion[] | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string, type?: 'ask' | 'interpret' | 'hint' | 'quiz') => {
    const text = queryText || inputPrompt;
    if (!text && type !== 'quiz' && type !== 'interpret') return;

    const userMsg: AIMessage = {
      id: String(Date.now()),
      role: 'user',
      content: text || (type === 'interpret' ? 'Interpret my experimental results' : 'Generate concept quiz'),
      timestamp: Date.now(),
      source: 'offline',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const response: AIResponse = await requestAIAssistant({
        ...context,
        prompt: text,
        type: type || 'ask',
      });

      if (response.quiz && response.quiz.length > 0) {
        setActiveQuiz(response.quiz);
        setSelectedAnswers({});
        setShowQuizResults(false);
      }

      const botMsg: AIMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: response.reply,
        timestamp: Date.now(),
        source: response.source,
        suggestedActions: response.suggestedActions,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: 'Unable to reach the assistant service. Please check your parameters and try again.',
          timestamp: Date.now(),
          source: 'offline',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (qId: string, optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-[#090f1d] border-l border-sky-500/20 shadow-2xl flex flex-col backdrop-blur-xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-sky-500/15 flex items-center justify-between bg-[#0b1426]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>SciNiraula AI Assistant</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Socratic
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Contextual Laboratory Intelligence</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Telemetry Snapshot Banner */}
      <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between overflow-x-auto">
        <span className="text-sky-400 font-semibold">Active Context:</span>
        <span className="truncate max-w-[280px]">
          {Object.entries(context.parameters || {})
            .slice(0, 3)
            .map(([k, v]) => `${k}:${v}`)
            .join(' | ')}
        </span>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-sky-500 text-slate-950 font-medium rounded-br-none'
                  : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none shadow-md'
              }`}
            >
              {/* Formatted Markdown Rendering */}
              <div className="whitespace-pre-wrap space-y-2">
                {msg.content}
              </div>

              {msg.source && msg.role === 'assistant' && (
                <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Engine: {msg.source === 'gemini' ? 'Gemini 2.5 Flash' : 'SciNiraula Offline Physics Core'}</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              )}
            </div>

            {/* Suggested Follow-up Actions */}
            {msg.suggestedActions && msg.suggestedActions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5 max-w-[95%]">
                {msg.suggestedActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(action)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 border border-sky-500/20 text-sky-300 hover:bg-sky-500/10 hover:border-sky-500/40 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Interactive Concept Quiz Modal inside Chat */}
        {activeQuiz && (
          <div className="p-4 rounded-xl bg-slate-900 border border-sky-500/30 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-sky-400">
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-sky-400" />
                Laboratory Concept Quiz
              </span>
              <button
                onClick={() => setActiveQuiz(null)}
                className="text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            {activeQuiz.map((q, qIndex) => {
              const selected = selectedAnswers[q.id];
              const isAnswered = selected !== undefined;
              const isCorrect = selected === q.correctIndex;

              return (
                <div key={q.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-medium text-white">
                    {qIndex + 1}. {q.question}
                  </div>
                  <div className="space-y-1.5">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selected === optIdx;
                      let btnClass = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-sky-500/40';
                      if (showQuizResults) {
                        if (optIdx === q.correctIndex) {
                          btnClass = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300';
                        } else if (isOptionSelected) {
                          btnClass = 'bg-rose-500/20 border-rose-500/50 text-rose-300';
                        }
                      } else if (isOptionSelected) {
                        btnClass = 'bg-sky-500/20 border-sky-500 text-white';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={showQuizResults}
                          onClick={() => handleOptionSelect(q.id, optIdx)}
                          className={`w-full text-left text-xs p-2 rounded-lg border transition-colors flex items-center justify-between ${btnClass}`}
                        >
                          <span>{opt}</span>
                          {showQuizResults && optIdx === q.correctIndex && (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {showQuizResults && (
                    <div className="pt-2 text-[11px] text-slate-300 leading-normal border-t border-slate-800">
                      <span className="font-semibold text-sky-400">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}

            {!showQuizResults ? (
              <button
                onClick={() => setShowQuizResults(true)}
                disabled={Object.keys(selectedAnswers).length < activeQuiz.length}
                className="w-full py-2 rounded-lg text-xs font-semibold bg-sky-500 disabled:opacity-50 text-slate-950 transition-colors"
              >
                Submit Answers
              </button>
            ) : (
              <button
                onClick={() => {
                  setActiveQuiz(null);
                  setShowQuizResults(false);
                }}
                className="w-full py-2 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700"
              >
                Finish Quiz
              </button>
            )}
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-sky-400 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
            <span>Analyzing experimental telemetry and equations...</span>
          </div>
        )}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px]">
        <button
          onClick={() => handleSend('Interpret what my experimental results tell me.', 'interpret')}
          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-sky-500/40 text-slate-300 hover:text-white flex items-center gap-1.5 whitespace-nowrap"
        >
          <BookOpen className="w-3 h-3 text-sky-400" />
          <span>Interpret Results</span>
        </button>

        <button
          onClick={() => handleSend('Give me a step-by-step hint for this experiment.', 'hint')}
          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-sky-500/40 text-slate-300 hover:text-white flex items-center gap-1.5 whitespace-nowrap"
        >
          <Lightbulb className="w-3 h-3 text-amber-400" />
          <span>Hint</span>
        </button>

        <button
          onClick={() => handleSend('Generate an interactive concept quiz for my current settings.', 'quiz')}
          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-sky-500/40 text-slate-300 hover:text-white flex items-center gap-1.5 whitespace-nowrap"
        >
          <HelpCircle className="w-3 h-3 text-emerald-400" />
          <span>Take Quiz</span>
        </button>
      </div>

      {/* Input bar */}
      <div className="p-4 bg-[#070b14] border-t border-sky-500/15">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask about this experiment..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={loading}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={loading || !inputPrompt.trim()}
            className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-slate-950 font-bold transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

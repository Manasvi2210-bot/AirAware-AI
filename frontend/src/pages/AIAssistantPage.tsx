import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCity } from '../context/CityContext';
import { SectionHeader } from '../components/common/SectionHeader';
import { GlassCard } from '../components/common/GlassCard';
import type { ChatMessage } from '../types/airQuality';
import { airQualityService } from '../services/airQualityService';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Trash2,
  Copy,
  Check,
} from 'lucide-react';

export const AIAssistantPage: React.FC = () => {
  const { currentCity, sensitivityProfile } = useCity();

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-message',
      sender: 'assistant',
      text: `Hello! I am **AirAware Brain**, your environmental health intelligence copilot. I am currently monitoring live telemetry for **${currentCity.name}** (Current AQI: **${currentCity.currentAQI}**).\n\nAsk me anything about outdoor workout safety, asthma precautions, indoor air filtration, or current pollutant drivers!`,
      timestamp: 'Just now',
      suggestions: [
        `Is it safe for a run in ${currentCity.name} right now?`,
        'Why are PM2.5 levels elevated today?',
        'Should I open the windows or keep them closed?',
        'What type of mask provides adequate protection?',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const responseText = await airQualityService.queryAIAssistant(
        trimmed,
        currentCity,
        sensitivityProfile
      );

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: "I encountered an error analyzing current atmospheric sensor data. Please retry.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'cleared-welcome',
        sender: 'assistant',
        text: `Chat cleared. Ready for your environmental inquiries regarding **${currentCity.name}**.`,
        timestamp: 'Just now',
        suggestions: [
          `Is it safe for outdoor sports right now?`,
          `Explain current AQI risks for children & elderly.`,
        ],
      },
    ]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <SectionHeader
        title="AI Health & Environmental Copilot"
        subtitle={`AirAware Brain • Contextual advisory trained on WHO epidemiological guidelines for ${currentCity.name}`}
        icon={<Bot className="w-5 h-5 text-cyan-400" />}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 text-xs transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        }
      />

      {/* AI Prototype Banner Notice */}
      <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-cyan-300">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong>Simulated Prototype Mode:</strong> Answers respond dynamically to currently selected city ({currentCity.name}), AQI ({currentCity.currentAQI}), and your Health Sensitivity profile.
          </span>
        </div>
        <span className="font-mono text-[10px] text-cyan-400/80 uppercase">
          LLM Integration Ready
        </span>
      </div>

      {/* Chat Conversation Card */}
      <GlassCard padding="none" className="flex flex-col h-[620px] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        {/* Chat Messages Scrollable Box */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-gradient-to-br from-teal-500 to-cyan-600 text-slate-950 shadow-md shadow-cyan-500/20'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-2">
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border ${
                      isUser
                        ? 'bg-cyan-500/15 border-cyan-500/30 text-white rounded-tr-none'
                        : 'bg-slate-900/90 border-white/10 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                  </div>

                  {/* Metadata and Copy Button */}
                  <div
                    className={`flex items-center gap-2 text-[10px] text-slate-500 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:text-slate-300 transition-colors"
                        title="Copy response"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Suggestion pills if present */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-2">
                      {msg.suggestions.map((suggestion, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSendMessage(suggestion)}
                          className="text-xs px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-cyan-500/15 text-slate-300 hover:text-cyan-300 border border-white/5 hover:border-cyan-500/30 transition-all text-left"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 mr-auto max-w-xl">
              <div className="w-8 h-8 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 rounded-tl-none flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                <span
                  className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                />
                <span className="text-xs text-slate-400 ml-2">
                  Analyzing atmospheric vectors...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar Footer */}
        <div className="p-3 sm:p-4 bg-slate-950/80 border-t border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputQuery);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={`Ask AirAware Brain about ${currentCity.name}'s air quality, workout safety, or health...`}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-900/90 border border-white/10 focus:border-cyan-500 focus:outline-none text-xs sm:text-sm text-white placeholder-slate-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/20 flex items-center gap-2 text-xs sm:text-sm shrink-0"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </GlassCard>
    </motion.div>
  );
};

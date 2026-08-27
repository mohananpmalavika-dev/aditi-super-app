import React, { createContext, useContext, useState } from 'react';
import { queryOmniBrain } from '../services/freeAiService';
import { BrainMessage, BrainThoughtTrace } from '../types/superApp';
import { useSuperApp } from './SuperAppContext';

interface OmniBrainContextType {
  messages: BrainMessage[];
  isThinking: boolean;
  activeThoughtStream: BrainThoughtTrace[];
  isAgentDrawerOpen: boolean;
  openAgentDrawer: () => void;
  closeAgentDrawer: () => void;
  toggleAgentDrawer: () => void;
  askBrain: (query: string) => Promise<void>;
  clearConversation: () => void;
}

const OmniBrainContext = createContext<OmniBrainContextType | undefined>(undefined);

const INITIAL_BRAIN_MESSAGES: BrainMessage[] = [
  {
    id: 'msg-init-1',
    sender: 'brain',
    text: 'Hello! I am Aditi Brain, your personal AI assistant. I can help with tasks, search, recommendations, and app actions. How can I assist you today?',
    timestamp: 'Just now',
    suggestedPrompts: [
      'Create a new workflow',
      'Show recent updates',
      'Find a relevant service',
      'Summarize my priorities'
    ]
  }
];

export const OmniBrainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, tasks, properties, showToast } = useSuperApp();
  const [messages, setMessages] = useState<BrainMessage[]>(INITIAL_BRAIN_MESSAGES);
  const [isThinking, setIsThinking] = useState(false);
  const [activeThoughtStream, setActiveThoughtStream] = useState<BrainThoughtTrace[]>([]);
  const [isAgentDrawerOpen, setIsAgentDrawerOpen] = useState(false);

  const openAgentDrawer = () => setIsAgentDrawerOpen(true);
  const closeAgentDrawer = () => setIsAgentDrawerOpen(false);
  const toggleAgentDrawer = () => setIsAgentDrawerOpen((prev) => !prev);

  const askBrain = async (query: string) => {
    if (!query.trim() || isThinking) return;

    const userMsg: BrainMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);
    setActiveThoughtStream([
      {
        step: 'Ingesting Context',
        details: `Processing query: "${query}"`,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);

    try {
      const response = await queryOmniBrain(query, {
        userName: user.name,
        tasksCount: tasks.length,
        activePropertiesCount: properties.length
      });

      // Update thoughts step by step
      if (response.thoughtTraces) {
        setActiveThoughtStream(response.thoughtTraces);
      }

      setMessages((prev) => [...prev, response]);

      if (response.actionDispatched) {
        showToast(`🧠 Aditi Brain: Dispatched action to ${response.actionDispatched.vertical.toUpperCase()}!`);
      }
    } catch (err) {
      const errorMsg: BrainMessage = {
        id: `err-${Date.now()}`,
        sender: 'brain',
        text: 'I encountered a brief latency glitch with the neural gateway, but my local engine is fully operational. How else can I assist you?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const clearConversation = () => {
    setMessages(INITIAL_BRAIN_MESSAGES);
    setActiveThoughtStream([]);
    showToast('Conversation reset.');
  };

  return (
    <OmniBrainContext.Provider
      value={{
        messages,
        isThinking,
        activeThoughtStream,
        isAgentDrawerOpen,
        openAgentDrawer,
        closeAgentDrawer,
        toggleAgentDrawer,
        askBrain,
        clearConversation
      }}
    >
      {children}
    </OmniBrainContext.Provider>
  );
};

export const useOmniBrain = () => {
  const context = useContext(OmniBrainContext);
  if (!context) throw new Error('useOmniBrain must be used within OmniBrainProvider');
  return context;
};

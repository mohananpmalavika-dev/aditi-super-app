import { describe, it, expect } from 'vitest';
import { ChatMessageSchema, ChatPollSchema } from '../lib/validation/chatSchemas';

describe('Chat Message & Poll Validation', () => {
  it('validates a standard direct chat message', () => {
    const msg = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      chatId: 'chat-general',
      senderId: 'usr-100',
      senderName: 'Aditi',
      text: 'Hello, world!'
    };
    const result = ChatMessageSchema.safeParse(msg);
    expect(result.success).toBe(true);
  });

  it('validates disappearing message configuration', () => {
    const msg = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      chatId: 'chat-secret',
      senderId: 'usr-100',
      senderName: 'Aditi',
      text: 'Self destructing message',
      isDisappearing: true,
      expiresDuration: 30
    };
    const result = ChatMessageSchema.safeParse(msg);
    expect(result.success).toBe(true);
  });

  it('validates interactive chat polls', () => {
    const poll = {
      question: 'Which framework do you prefer?',
      options: [
        { id: 'opt-1', text: 'React', votes: [] },
        { id: 'opt-2', text: 'Vue', votes: [] }
      ]
    };
    const result = ChatPollSchema.safeParse(poll);
    expect(result.success).toBe(true);
  });

  it('rejects chat polls with fewer than 2 options', () => {
    const invalidPoll = {
      question: 'Single choice question?',
      options: [{ id: 'opt-1', text: 'Only option', votes: [] }]
    };
    const result = ChatPollSchema.safeParse(invalidPoll);
    expect(result.success).toBe(false);
  });
});

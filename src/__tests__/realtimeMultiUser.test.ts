import { describe, it, expect } from 'vitest';

describe('Multi-User Realtime Messaging & Access Control Tests', () => {
  interface MockMessage {
    id: string;
    conversationId: string;
    senderId: string;
    text: string;
    expiresAt?: number;
  }

  interface MockConversationMember {
    conversationId: string;
    userId: string;
    role: 'admin' | 'member';
  }

  const members: MockConversationMember[] = [
    { conversationId: 'conv-1', userId: 'user-a', role: 'admin' },
    { conversationId: 'conv-1', userId: 'user-b', role: 'member' }
  ];

  const blockedList: { blockerId: string; blockedId: string }[] = [];

  function canSendMessage(senderId: string, recipientId: string, conversationId: string): { allowed: boolean; reason?: string } {
    const isBlocked = blockedList.some(b => b.blockerId === recipientId && b.blockedId === senderId);
    if (isBlocked) {
      return { allowed: false, reason: 'BLOCKED' };
    }

    const isMember = members.some(m => m.conversationId === conversationId && m.userId === senderId);
    if (!isMember) {
      return { allowed: false, reason: 'NOT_A_MEMBER' };
    }

    return { allowed: true };
  }

  function filterActiveMessages(messages: MockMessage[], now: number): MockMessage[] {
    return messages.filter(m => !m.expiresAt || m.expiresAt > now);
  }

  it('allows conversation members to dispatch messages', () => {
    const result = canSendMessage('user-a', 'user-b', 'conv-1');
    expect(result.allowed).toBe(true);
  });

  it('rejects message dispatch from non-members', () => {
    const result = canSendMessage('user-unauthorized', 'user-b', 'conv-1');
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('NOT_A_MEMBER');
  });

  it('rejects messages when sender is blocked by recipient', () => {
    blockedList.push({ blockerId: 'user-b', blockedId: 'user-a' });
    const result = canSendMessage('user-a', 'user-b', 'conv-1');
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('BLOCKED');
  });

  it('filters out server-expired disappearing messages accurately', () => {
    const now = 1000000;
    const testMessages: MockMessage[] = [
      { id: 'm1', conversationId: 'conv-1', senderId: 'user-a', text: 'Permanent msg' },
      { id: 'm2', conversationId: 'conv-1', senderId: 'user-a', text: 'Expired msg', expiresAt: now - 500 },
      { id: 'm3', conversationId: 'conv-1', senderId: 'user-a', text: 'Active msg', expiresAt: now + 5000 }
    ];

    const active = filterActiveMessages(testMessages, now);
    expect(active.length).toBe(2);
    expect(active.map(m => m.id)).toEqual(['m1', 'm3']);
  });
});

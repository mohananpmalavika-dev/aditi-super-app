import { describe, it, expect } from 'vitest';
import {
  createOutgoingMessage,
  transitionMessageStatus,
  editMessageInList,
  deleteMessageInList,
  pinMessageToConversation,
  unpinMessageFromConversation,
  searchMessagesInConversation,
  filterConversationsByFolder,
  extractSharedMediaVault,
  generateGroupInviteLink,
  extractTaskFromMessage,
  generateUnreadSummary,
  registerTypingEvent,
  getActiveTypingLabel
} from '../services/messagingEngine';
import { ChatMessage, ChatConversation } from '../types/superApp';

describe('Production Messaging Engine & Delivery State Machine', () => {
  it('creates idempotent outgoing message with clientMessageId and sending status', () => {
    const msg = createOutgoingMessage('u-1', 'Malavika', 'Hello team, project update ready!');
    expect(msg.clientMessageId).toBeDefined();
    expect(msg.id).toContain('msg-');
    expect(msg.status).toBe('sending');
    expect(msg.isUser).toBe(true);
    expect(msg.text).toBe('Hello team, project update ready!');
    expect(msg.deliveryReceipts?.length).toBe(1);
  });

  it('transitions delivery state through state machine with recipient receipts', () => {
    const initialMsg = createOutgoingMessage('u-1', 'Malavika', 'Contract ready for review');
    
    // Server accepts (Sent)
    const sentMsg = transitionMessageStatus(initialMsg, 'sent');
    expect(sentMsg.status).toBe('sent');

    // Recipient receives (Delivered)
    const deliveredMsg = transitionMessageStatus(sentMsg, 'delivered', {
      userId: 'u-2',
      userName: 'Arun Kumar'
    });
    expect(deliveredMsg.status).toBe('delivered');
    const arunReceipt = deliveredMsg.deliveryReceipts?.find((r) => r.userId === 'u-2');
    expect(arunReceipt).toBeDefined();
    expect(arunReceipt?.deliveredAt).toBeDefined();

    // Recipient opens (Read)
    const readMsg = transitionMessageStatus(deliveredMsg, 'read', {
      userId: 'u-2',
      userName: 'Arun Kumar'
    });
    expect(readMsg.status).toBe('read');
    const arunReadReceipt = readMsg.deliveryReceipts?.find((r) => r.userId === 'u-2');
    expect(arunReadReceipt?.readAt).toBeDefined();
  });

  it('edits messages authoritatively and tracks edit count and timestamps', () => {
    const messages: ChatMessage[] = [
      createOutgoingMessage('u-1', 'User', 'Original text with typo')
    ];
    const targetId = messages[0].id;

    const { updatedMessages, editedMessage } = editMessageInList(
      messages,
      targetId,
      'Corrected text without typo'
    );

    expect(updatedMessages[0].text).toBe('Corrected text without typo');
    expect(updatedMessages[0].editedAt).toBeDefined();
    expect(updatedMessages[0].editCount).toBe(1);
    expect(editedMessage?.text).toBe('Corrected text without typo');
  });

  it('handles tombstone deletion for everyone vs deletion for me', () => {
    const msg1 = createOutgoingMessage('u-1', 'User', 'Message 1');
    const msg2 = createOutgoingMessage('u-1', 'User', 'Message 2');
    const list: ChatMessage[] = [msg1, msg2];

    // Delete for everyone
    const afterDeleteEveryone = deleteMessageInList(list, msg1.id, true);
    expect(afterDeleteEveryone[0].isDeleted).toBe(true);
    expect(afterDeleteEveryone[0].deletedForEveryone).toBe(true);
    expect(afterDeleteEveryone[0].text).toBe('🚫 This message was deleted');
    expect(afterDeleteEveryone.length).toBe(2);

    // Delete for me
    const afterDeleteForMe = deleteMessageInList(list, msg2.id, false);
    expect(afterDeleteForMe.length).toBe(1);
    expect(afterDeleteForMe.find((m) => m.id === msg2.id)).toBeUndefined();
  });

  it('pins and unpins messages authoritatively across conversation members', () => {
    const mockChat: ChatConversation = {
      id: 'c-1',
      participantName: 'Core Engineering',
      participantAvatar: '',
      roleOrContext: 'Group',
      lastMessage: '',
      lastMessageTime: '',
      unreadCount: 0,
      isOnline: true,
      messages: []
    };

    const msgToPin = createOutgoingMessage('u-1', 'Aditi Admin', 'Release 2.0 at 5 PM');
    const pinnedChat = pinMessageToConversation(mockChat, msgToPin, 'Aditi Admin');

    expect(pinnedChat.isPinned).toBe(true);
    expect(pinnedChat.pinnedMessages?.length).toBe(1);
    expect(pinnedChat.pinnedMessages?.[0].text).toBe('Release 2.0 at 5 PM');

    const unpinnedChat = unpinMessageFromConversation(pinnedChat, msgToPin.id);
    expect(unpinnedChat.pinnedMessages?.length).toBe(0);
  });

  it('searches messages with keyword, document, media, and link filters', () => {
    const messages: ChatMessage[] = [
      createOutgoingMessage('u-1', 'Arun', 'Here is the quotation document', {
        mediaType: 'file',
        fileName: 'quotation_v2.pdf'
      }),
      createOutgoingMessage('u-2', 'Malavika', 'Check out the website https://aditi.app for updates'),
      createOutgoingMessage('u-1', 'Arun', 'Photo from the site inspection', {
        mediaType: 'image',
        mediaUrl: 'https://example.com/site.jpg'
      })
    ];

    // Search by keyword
    const searchRes = searchMessagesInConversation(messages, 'quotation');
    expect(searchRes.length).toBe(1);
    expect(searchRes[0].fileName).toBe('quotation_v2.pdf');

    // Filter by Docs
    const docRes = searchMessagesInConversation(messages, '', 'docs');
    expect(docRes.length).toBe(1);

    // Filter by Links
    const linkRes = searchMessagesInConversation(messages, '', 'links');
    expect(linkRes.length).toBe(1);
    expect(linkRes[0].text).toContain('https://aditi.app');

    // Filter by Media
    const mediaRes = searchMessagesInConversation(messages, '', 'media');
    expect(mediaRes.length).toBe(1);
  });

  it('filters conversation inboxes by folder (All, Unread, Groups, Channels, Favorites)', () => {
    const chats: ChatConversation[] = [
      {
        id: 'c-1',
        participantName: 'Direct Chat 1',
        participantAvatar: '',
        roleOrContext: 'Personal',
        lastMessage: 'Hi',
        lastMessageTime: '10:00 AM',
        unreadCount: 2,
        isOnline: true,
        conversationType: 'direct',
        messages: []
      },
      {
        id: 'c-2',
        participantName: 'Aditi Kerala Community',
        participantAvatar: '',
        roleOrContext: 'Group',
        lastMessage: 'Meeting at 4',
        lastMessageTime: '10:05 AM',
        unreadCount: 0,
        isOnline: true,
        conversationType: 'group',
        messages: []
      },
      {
        id: 'c-3',
        participantName: 'Deals & Updates',
        participantAvatar: '',
        roleOrContext: 'Channel',
        lastMessage: 'New deal',
        lastMessageTime: '10:10 AM',
        unreadCount: 0,
        isOnline: true,
        conversationType: 'channel',
        isFavorite: true,
        messages: []
      }
    ];

    expect(filterConversationsByFolder(chats, 'all').length).toBe(3);
    expect(filterConversationsByFolder(chats, 'unread').length).toBe(1);
    expect(filterConversationsByFolder(chats, 'groups').length).toBe(1);
    expect(filterConversationsByFolder(chats, 'channels').length).toBe(1);
    expect(filterConversationsByFolder(chats, 'favorites').length).toBe(1);
  });

  it('extracts shared media vault items', () => {
    const messages: ChatMessage[] = [
      createOutgoingMessage('u-1', 'Arun', 'Photo', { mediaType: 'image', mediaUrl: 'https://example.com/p1.jpg' }),
      createOutgoingMessage('u-2', 'Suresh', 'Check https://kerala.gov.in'),
      createOutgoingMessage('u-1', 'Arun', 'Invoice', { mediaType: 'file', fileName: 'inv.pdf' })
    ];

    const vault = extractSharedMediaVault(messages);
    expect(vault.media.length).toBe(1);
    expect(vault.links.length).toBe(1);
    expect(vault.documents.length).toBe(1);
  });

  it('generates shareable group invite links and QR codes', () => {
    const invite = generateGroupInviteLink('group-123', 'Kerala Tech Hub');
    expect(invite.url).toContain('https://aditi.app/join/');
    expect(invite.qrCodeUrl).toContain('api.qrserver.com');
  });

  it('extracts tasks and generates AI unread summaries from messages', () => {
    const task = extractTaskFromMessage('Please send the lease agreement by tomorrow ASAP', 'Advocate Nair');
    expect(task.priority).toBe('urgent');
    expect(task.title).toContain('lease agreement');

    const summary = generateUnreadSummary(
      [
        createOutgoingMessage('u-1', 'Arun', 'Team agreed on the design system updates.'),
        createOutgoingMessage('u-2', 'Malavika', 'Meeting scheduled for tomorrow at 3 PM.')
      ],
      'Design Team'
    );
    expect(summary.actionItems.length).toBeGreaterThan(0);
    expect(summary.keyDecisions.length).toBeGreaterThan(0);
  });

  it('handles ephemeral typing registration and active typing labels', () => {
    registerTypingEvent('chat-1', 'u-2', 'Malavika');
    const label = getActiveTypingLabel('chat-1', 'u-1');
    expect(label).toBe('Malavika is typing...');
  });
});

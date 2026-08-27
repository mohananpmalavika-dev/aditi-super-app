import { z } from 'zod';

export const ChatMessageSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  chatId: z.string().min(1),
  senderId: z.string().min(1),
  senderName: z.string().min(1),
  text: z.string().max(4000),
  mediaUrl: z.string().url().or(z.string().startsWith('data:')).optional(),
  mediaType: z.enum(['image', 'video', 'audio', 'video_note', 'sticker', 'gif', 'file']).optional(),
  isDisappearing: z.boolean().optional(),
  expiresDuration: z.number().positive().nullable().optional(),
  expiresAt: z.string().datetime().optional(),
  replyToId: z.string().optional()
});

export const ScheduledMessageSchema = z.object({
  chatId: z.string().min(1),
  text: z.string().max(4000),
  scheduledTimestamp: z.number().positive(),
  deliveryType: z.enum(['message', 'call']).default('message'),
  voiceAudioUrl: z.string().optional()
});

export const ChatPollSchema = z.object({
  question: z.string().min(3).max(250),
  options: z.array(z.object({
    id: z.string(),
    text: z.string().min(1).max(120),
    votes: z.array(z.string()).default([])
  })).min(2).max(10)
});

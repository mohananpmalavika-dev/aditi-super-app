import {
  ChatConversation,
  HabitItem,
  MatrimonyProfile,
  ProactiveAlert,
  RealEstateProperty,
  SocialPost,
  SocialStory,
  TaskItem,
  TutorProfile,
  UserProfile,
  WalletTransaction
} from '../types/superApp';

import { generateSvgAvatar } from '../utils/avatarUtils';

export const INITIAL_USER: UserProfile = {
  id: 'usr-guest',
  name: 'Aditi User',
  avatar: generateSvgAvatar('Aditi User'),
  handle: '@aditi.user',
  email: '',
  zodiacSign: 'Leo',
  bio: 'Aditi member',
  location: 'Kozhikode, Kerala, India',
  isVerified: false
};

export const MOCK_PROPERTIES: RealEstateProperty[] = [];
export const MOCK_MATRIMONY_PROFILES: MatrimonyProfile[] = [];
export const MOCK_TUTORS: TutorProfile[] = [];
export const MOCK_STORIES: SocialStory[] = [];
export const MOCK_SOCIAL_POSTS: SocialPost[] = [];
export const MOCK_CHATS: ChatConversation[] = [];
export const MOCK_TRANSACTIONS: WalletTransaction[] = [];
export const MOCK_TASKS: TaskItem[] = [];
export const MOCK_HABITS: HabitItem[] = [];
export const MOCK_ALERTS: ProactiveAlert[] = [];


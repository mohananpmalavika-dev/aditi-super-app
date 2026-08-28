import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getCloudRegisteredUsers, 
  saveLocalAccount, 
  saveCustomContact, 
  getCustomContacts,
  getLocalAccounts 
} from '../services/cloudDatabaseService';
import { UserProfile } from '../types/superApp';

describe('Friend Discovery & Registered Users Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and retrieves registered local accounts in discoverable directory', async () => {
    const user1: UserProfile = {
      id: 'usr-malavika-101',
      name: 'Malavika Mohan',
      email: 'malavika@example.com',
      handle: '@malavika',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      zodiacSign: 'Leo',
      bio: 'Aditi Pro User',
      location: 'Kozhikode, Kerala',
      isVerified: true
    };

    const user2: UserProfile = {
      id: 'usr-arun-102',
      name: 'Arun Kumar',
      email: 'arun@example.com',
      handle: '@arun_k',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      zodiacSign: 'Aries',
      bio: 'Software Engineer',
      location: 'Kochi, Kerala',
      isVerified: true
    };

    saveLocalAccount('malavika@example.com', { password: 'Password@123', user: user1 });
    saveLocalAccount('arun@example.com', { password: 'Password@123', user: user2 });

    const registered = await getCloudRegisteredUsers();
    expect(registered.length).toBeGreaterThanOrEqual(2);

    const foundMalavika = registered.find((u) => u.email === 'malavika@example.com');
    const foundArun = registered.find((u) => u.email === 'arun@example.com');

    expect(foundMalavika).toBeDefined();
    expect(foundMalavika?.name).toBe('Malavika Mohan');
    expect(foundArun).toBeDefined();
    expect(foundArun?.name).toBe('Arun Kumar');
  });

  it('saves and persists custom manual contacts in discoverable directory', async () => {
    const customContact: UserProfile = {
      id: 'usr-custom-999',
      name: 'Dr. Suresh Varma',
      email: 'suresh@varma.clinic',
      handle: '@sureshvarma',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
      bio: 'Medical Consultant • +91 98470 12345',
      location: 'Custom Contact',
      zodiacSign: 'Scorpio',
      isVerified: true
    };

    saveCustomContact(customContact);

    const savedContacts = getCustomContacts();
    expect(savedContacts.length).toBe(1);
    expect(savedContacts[0].name).toBe('Dr. Suresh Varma');

    const allDiscoverable = await getCloudRegisteredUsers();
    const foundCustom = allDiscoverable.find((u) => u.name === 'Dr. Suresh Varma');
    expect(foundCustom).toBeDefined();
    expect(foundCustom?.handle).toBe('@sureshvarma');
  });

  it('deduplicates users by unique ID / email in directory', async () => {
    const user: UserProfile = {
      id: 'usr-dup-1',
      name: 'Aditi Ambassador',
      email: 'ambassador@aditi.app',
      handle: '@ambassador',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      bio: 'Ambassador',
      location: 'Kozhikode',
      zodiacSign: 'Virgo',
      isVerified: true
    };

    saveLocalAccount('ambassador@aditi.app', { password: 'Password@123', user });
    saveCustomContact(user); // Also save same email to custom contacts

    const allUsers = await getCloudRegisteredUsers();
    const matching = allUsers.filter((u) => u.email === 'ambassador@aditi.app');
    expect(matching.length).toBe(1);
  });
});

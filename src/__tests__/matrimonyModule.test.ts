import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getCloudMatrimonyProfiles, 
  createCloudMatrimonyProfile, 
  deleteCloudMatrimonyProfile, 
  sendCloudInterestToMatrimony, 
  toggleCloudShortlistMatrimony 
} from '../services/cloudDatabaseService';
import { MatrimonyProfile } from '../types/superApp';

describe('Matrimony Module: Bride & Groom Profile Management', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads default verified bride and groom profiles when storage is clean', async () => {
    const profiles = await getCloudMatrimonyProfiles();
    expect(profiles.length).toBeGreaterThanOrEqual(4);

    const brides = profiles.filter(p => p.gender === 'Female');
    const grooms = profiles.filter(p => p.gender === 'Male');

    expect(brides.length).toBeGreaterThan(0);
    expect(grooms.length).toBeGreaterThan(0);

    const first = profiles[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('name');
    expect(first).toHaveProperty('education');
    expect(first).toHaveProperty('profession');
    expect(first).toHaveProperty('religion');
    expect(first).toHaveProperty('community');
    expect(first).toHaveProperty('nakshatra');
  });

  it('creates and registers a new Bride profile with complete details', async () => {
    const newBride: Omit<MatrimonyProfile, 'id'> = {
      name: 'Dr. Meera Namboodiri',
      age: 25,
      gender: 'Female',
      height: "5' 4\" (163 cm)",
      profession: 'Assistant Professor (Biotechnology)',
      education: 'Ph.D in Biotechnology (IISc Bangalore)',
      city: 'Thrissur',
      state: 'Kerala',
      religion: 'Hindu',
      community: 'Brahmin (Namboodiri)',
      motherTongue: 'Malayalam',
      zodiac: 'Taurus',
      nakshatra: 'Karthika',
      photos: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500'],
      about: 'Passionate academician and classical dancer. Seeking an educated, progressive partner with shared cultural values.',
      partnerPreferences: 'Doctor, Professor, or Research Scientist from a cultured family.',
      annualIncome: '₹12 Lakhs - ₹16 Lakhs',
      isVerified: true,
      postedFor: 'Self',
      maritalStatus: 'Never Married',
      diet: 'Vegetarian',
      contactPhone: '+91 98472 99887',
      contactEmail: 'dr.meera@example.com'
    };

    const updatedList = await createCloudMatrimonyProfile(newBride);
    expect(updatedList.length).toBeGreaterThanOrEqual(1);

    const found = updatedList.find(p => p.name === 'Dr. Meera Namboodiri');
    expect(found).toBeDefined();
    expect(found?.gender).toBe('Female');
    expect(found?.nakshatra).toBe('Karthika');
    expect(found?.city).toBe('Thrissur');
    expect(found?.diet).toBe('Vegetarian');
  });

  it('creates and registers a new Groom profile with complete details', async () => {
    const newGroom: Omit<MatrimonyProfile, 'id'> = {
      name: 'Adv. Siddharth Warrier',
      age: 31,
      gender: 'Male',
      height: "5' 10\" (178 cm)",
      profession: 'Corporate Advocate & Legal Counsel',
      education: 'BA LLB (NLSIU Bangalore), LLM (Cambridge)',
      city: 'Kochi',
      state: 'Kerala',
      religion: 'Hindu',
      community: 'Warrier',
      motherTongue: 'Malayalam',
      zodiac: 'Libra',
      nakshatra: 'Chothi',
      photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'],
      about: 'Legal counsel for multinational firms. Enjoys tennis, marathon running, and reading philosophy.',
      partnerPreferences: 'Professional working in Law, Management, or Healthcare.',
      annualIncome: '₹30 Lakhs - ₹40 Lakhs',
      isVerified: true,
      postedFor: 'Self',
      maritalStatus: 'Never Married',
      diet: 'Non-Vegetarian',
      contactPhone: '+91 98951 22334'
    };

    const updatedList = await createCloudMatrimonyProfile(newGroom);
    const found = updatedList.find(p => p.name === 'Adv. Siddharth Warrier');
    expect(found).toBeDefined();
    expect(found?.gender).toBe('Male');
    expect(found?.nakshatra).toBe('Chothi');
    expect(found?.profession).toContain('Corporate Advocate');
  });

  it('sends interest and toggles shortlist on matrimony profiles', async () => {
    const profiles = await getCloudMatrimonyProfiles();
    const targetId = profiles[0].id;

    // Send Interest
    const afterInterest = await sendCloudInterestToMatrimony(targetId);
    const interested = afterInterest.find(p => p.id === targetId);
    expect(interested?.interestSent).toBe(true);

    // Toggle Shortlist
    const afterShortlist = await toggleCloudShortlistMatrimony(targetId);
    const shortlisted = afterShortlist.find(p => p.id === targetId);
    expect(shortlisted?.isShortlisted).toBe(true);
  });

  it('deletes a registered matrimony profile properly', async () => {
    const createdList = await createCloudMatrimonyProfile({
      name: 'Temp Profile To Delete',
      age: 28,
      gender: 'Male',
      height: "5' 8\"",
      profession: 'Tester',
      education: 'B.Sc',
      city: 'Calicut',
      state: 'Kerala',
      religion: 'Hindu',
      community: 'General',
      motherTongue: 'Malayalam',
      zodiac: 'Aries',
      photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500'],
      about: 'Temporary bio',
      partnerPreferences: 'Any',
      annualIncome: '₹10L',
      isVerified: true
    });

    const target = createdList.find(p => p.name === 'Temp Profile To Delete');
    expect(target).toBeDefined();

    const afterDelete = await deleteCloudMatrimonyProfile(target!.id);
    expect(afterDelete.some(p => p.id === target!.id)).toBe(false);
  });
});

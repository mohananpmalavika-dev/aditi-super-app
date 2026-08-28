import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getCloudPropertyRequirements, 
  createCloudPropertyRequirement, 
  deleteCloudPropertyRequirement, 
  toggleCloudSaveRequirement 
} from '../services/cloudDatabaseService';
import { PropertyRequirement } from '../types/superApp';

describe('Real Estate Module: Buyer & Tenant Property Requirements', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads default initial buyer & tenant requirements when storage is clean', async () => {
    const requirements = await getCloudPropertyRequirements();
    expect(requirements.length).toBeGreaterThanOrEqual(4);
    
    // Check that we have both Buy and Rent requirements
    const buyReqs = requirements.filter(r => r.requirementType === 'Buy');
    const rentReqs = requirements.filter(r => r.requirementType === 'Rent');
    expect(buyReqs.length).toBeGreaterThan(0);
    expect(rentReqs.length).toBeGreaterThan(0);

    // Verify first requirement structure
    const first = requirements[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('title');
    expect(first).toHaveProperty('propertyCategory');
    expect(first).toHaveProperty('preferredLocations');
    expect(first).toHaveProperty('budgetFormatted');
    expect(first).toHaveProperty('contactName');
    expect(first).toHaveProperty('contactPhone');
  });

  it('creates and persists a new buyer requirement with specific preferences', async () => {
    const newRequirementData: Omit<PropertyRequirement, 'id'> = {
      title: '3 BHK Sea View Apartment Wanted in Calicut',
      requirementType: 'Buy',
      propertyCategory: 'Apartment',
      preferredLocations: ['Kozhikode Beach', 'Chakkorathukulam', 'Nadakkavu'],
      city: 'Kozhikode',
      minBudget: 8000000,
      maxBudget: 13000000,
      budgetFormatted: '₹80 Lakhs - ₹1.30 Cr',
      bedrooms: 3,
      bathrooms: 3,
      minAreaSqFt: 1800,
      furnishing: 'Semi-Furnished',
      timeline: 'Immediate',
      specificNeeds: 'Must have unhindered Arabian sea view, dedicated EV charger parking, and 24/7 security.',
      contactName: 'Vivek Menon',
      contactPhone: '+91 98460 77889',
      contactEmail: 'vivek.menon@example.com',
      contactAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      isVerifiedBuyer: true,
      createdAt: 'Just now'
    };

    const updatedList = await createCloudPropertyRequirement(newRequirementData);
    expect(updatedList.length).toBeGreaterThanOrEqual(1);

    const created = updatedList.find(r => r.title === '3 BHK Sea View Apartment Wanted in Calicut');
    expect(created).toBeDefined();
    expect(created?.requirementType).toBe('Buy');
    expect(created?.propertyCategory).toBe('Apartment');
    expect(created?.minBudget).toBe(8000000);
    expect(created?.bedrooms).toBe(3);
    expect(created?.furnishing).toBe('Semi-Furnished');
    expect(created?.timeline).toBe('Immediate');
    expect(created?.preferredLocations).toContain('Kozhikode Beach');
  });

  it('toggles bookmark / saved status on buyer requirements', async () => {
    const requirements = await getCloudPropertyRequirements();
    const targetId = requirements[0].id;
    const initialSaved = !!requirements[0].isSaved;

    const updatedOnce = await toggleCloudSaveRequirement(targetId);
    const toggled = updatedOnce.find(r => r.id === targetId);
    expect(toggled?.isSaved).toBe(!initialSaved);

    const updatedTwice = await toggleCloudSaveRequirement(targetId);
    const toggledBack = updatedTwice.find(r => r.id === targetId);
    expect(toggledBack?.isSaved).toBe(initialSaved);
  });

  it('deletes a property requirement properly', async () => {
    const newReq = await createCloudPropertyRequirement({
      title: 'Temporary Requirement to Delete',
      requirementType: 'Rent',
      propertyCategory: 'Commercial',
      preferredLocations: ['MG Road'],
      city: 'Kochi',
      minBudget: 25000,
      maxBudget: 40000,
      budgetFormatted: '₹25,000 - ₹40,000 / mo',
      specificNeeds: 'Temporary need',
      contactName: 'Tester',
      contactPhone: '+91 99999 88888',
      createdAt: 'Just now'
    });

    const created = newReq.find(r => r.title === 'Temporary Requirement to Delete');
    expect(created).toBeDefined();
    const createdId = created!.id;

    const afterDelete = await deleteCloudPropertyRequirement(createdId);
    expect(afterDelete.some(r => r.id === createdId)).toBe(false);
  });
});

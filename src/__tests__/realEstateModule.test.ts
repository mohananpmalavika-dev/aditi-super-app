import { describe, it, expect } from 'vitest';
import {
  createCloudProperty,
  getCloudProperties,
  toggleCloudSaveProperty,
  deleteCloudProperty
} from '../services/cloudDatabaseService';
import { RealEstateProperty } from '../types/superApp';

describe('Real Estate Module: Property Listing & Details Management', () => {
  it('creates and lists a new property with full details', async () => {
    const newPropertyData: Omit<RealEstateProperty, 'id' | 'isSaved'> = {
      title: 'Luxury 4 BHK Waterfront Villa',
      type: 'Villa',
      listingType: 'Buy',
      price: 15000000,
      priceFormatted: '₹1.50 Cr',
      bedrooms: 4,
      bathrooms: 4,
      areaSqFt: 3200,
      location: 'Panampilly Nagar',
      city: 'Kochi (Ernakulam)',
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
      features: ['Swimming Pool', '24/7 Gated Security', 'Covered Car Parking'],
      description: 'Exclusive private villa with landscaped garden and solar power.',
      agent: {
        name: 'Arjun Menon',
        phone: '+91 98470 54321',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        rating: 4.9
      },
      isFeatured: true
    };

    const updatedList = await createCloudProperty(newPropertyData);
    const added = updatedList.find((p) => p.title === 'Luxury 4 BHK Waterfront Villa');

    expect(added).toBeDefined();
    expect(added?.id).toContain('prop-');
    expect(added?.price).toBe(15000000);
    expect(added?.priceFormatted).toBe('₹1.50 Cr');
    expect(added?.bedrooms).toBe(4);
    expect(added?.city).toBe('Kochi (Ernakulam)');
    expect(added?.features).toContain('Swimming Pool');
  });

  it('toggles bookmark / saved status on property', async () => {
    const properties = await getCloudProperties();
    const target = properties[0];
    expect(target).toBeDefined();

    const updatedList = await toggleCloudSaveProperty(target.id);
    const modified = updatedList.find((p) => p.id === target.id);
    expect(modified?.isSaved).toBe(!target.isSaved);
  });

  it('deletes a property listing properly', async () => {
    const testProp: Omit<RealEstateProperty, 'id' | 'isSaved'> = {
      title: 'Temporary Test Flat',
      type: 'Apartment',
      listingType: 'Rent',
      price: 25000,
      priceFormatted: '₹25,000/mo',
      bedrooms: 2,
      bathrooms: 2,
      areaSqFt: 1100,
      location: 'Kowdiar',
      city: 'Thiruvananthapuram',
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
      features: ['Covered Car Parking'],
      description: 'Cozy 2 BHK rental apartment near Kowdiar Palace.',
      agent: {
        name: 'Lakshmi Nair',
        phone: '+91 94470 12345',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        rating: 4.8
      }
    };

    const listWithNew = await createCloudProperty(testProp);
    const created = listWithNew.find((p) => p.title === 'Temporary Test Flat');
    expect(created).toBeDefined();

    const listAfterDelete = await deleteCloudProperty(created!.id);
    const foundAfter = listAfterDelete.find((p) => p.id === created!.id);
    expect(foundAfter).toBeUndefined();
  });
});

/**
 * Location Autocomplete Service
 * Instant matching for Indian states/districts (e.g. "kollam" -> "Kollam, Kerala, India")
 * and global metropolitan areas with Open-Meteo geocoding fallback.
 */

export interface LocationSuggestion {
  name: string;
  formatted: string;
  country: string;
  admin1?: string;
}

const COMMON_PLACES: LocationSuggestion[] = [
  // Kerala Districts & Cities
  { name: 'Kollam', formatted: 'Kollam, Kerala, India', country: 'India', admin1: 'Kerala' },
  { name: 'Kochi', formatted: 'Kochi, Kerala, India', country: 'India', admin1: 'Kerala' },
  { name: 'Thiruvananthapuram', formatted: 'Thiruvananthapuram, Kerala, India', country: 'India', admin1: 'Kerala' },
  { name: 'Trivandrum', formatted: 'Thiruvananthapuram (Trivandrum), Kerala, India', country: 'India', admin1: 'Kerala' },
  { name: 'Kozhikode', formatted: 'Kozhikode (Calicut), Kerala, India', country: 'India', admin1: 'Kerala' },
  { name: 'Calicut', formatted: 'Kozhikode (Calicut), Kerala, India', country: 'India', admin1: 'Kerala' },
  { name: 'Thrissur', formatted: 'Thrissur, Kerala, India', country: 'India', admin1: 'Kerala' },
  { name: 'Alappuzha', formatted: 'Alappuzha (Alleppey), Kerala, India', country: 'India', admin1: 'Kerala' },
  { name: 'Alleppey', formatted: 'Alappuzha (Alleppey), Kerala, India', country: 'India', admin1: 'Kerala' },
  { name: 'Palakkad', formatted: 'Palakkad, Kerala, India', country: 'India', admin1: 'Kerala' },
  { name: 'Kottayam', formatted: 'Kottayam, Kerala, India', country: 'India', admin1: 'Kerala' },
  { name: 'Malappuram', formatted: 'Malappuram, Kerala, India', country: 'India', admin1: 'Kerala' },
  { name: 'Kannur', formatted: 'Kannur, Kerala, India', country: 'India', admin1: 'Kerala' },
  { name: 'Kasaragod', formatted: 'Kasaragod, Kerala, India', country: 'India', admin1: 'Kerala' },
  { name: 'Pathanamthitta', formatted: 'Pathanamthitta, Kerala, India', country: 'India', admin1: 'Kerala' },
  { name: 'Idukki', formatted: 'Idukki, Kerala, India', country: 'India', admin1: 'Kerala' },
  { name: 'Wayanad', formatted: 'Wayanad, Kerala, India', country: 'India', admin1: 'Kerala' },
  { name: 'Guruvayur', formatted: 'Guruvayur, Kerala, India', country: 'India', admin1: 'Kerala' },
  { name: 'Varkala', formatted: 'Varkala, Kerala, India', country: 'India', admin1: 'Kerala' },
  { name: 'Munnar', formatted: 'Munnar, Kerala, India', country: 'India', admin1: 'Kerala' },

  // Major Indian Metros & Cities
  { name: 'Bengaluru', formatted: 'Bengaluru, Karnataka, India', country: 'India', admin1: 'Karnataka' },
  { name: 'Bangalore', formatted: 'Bengaluru (Bangalore), Karnataka, India', country: 'India', admin1: 'Karnataka' },
  { name: 'Chennai', formatted: 'Chennai, Tamil Nadu, India', country: 'India', admin1: 'Tamil Nadu' },
  { name: 'Coimbatore', formatted: 'Coimbatore, Tamil Nadu, India', country: 'India', admin1: 'Tamil Nadu' },
  { name: 'Madurai', formatted: 'Madurai, Tamil Nadu, India', country: 'India', admin1: 'Tamil Nadu' },
  { name: 'Mumbai', formatted: 'Mumbai, Maharashtra, India', country: 'India', admin1: 'Maharashtra' },
  { name: 'Pune', formatted: 'Pune, Maharashtra, India', country: 'India', admin1: 'Maharashtra' },
  { name: 'Delhi', formatted: 'New Delhi, Delhi, India', country: 'India', admin1: 'Delhi' },
  { name: 'New Delhi', formatted: 'New Delhi, Delhi, India', country: 'India', admin1: 'Delhi' },
  { name: 'Hyderabad', formatted: 'Hyderabad, Telangana, India', country: 'India', admin1: 'Telangana' },
  { name: 'Kolkata', formatted: 'Kolkata, West Bengal, India', country: 'India', admin1: 'West Bengal' },
  { name: 'Ahmedabad', formatted: 'Ahmedabad, Gujarat, India', country: 'India', admin1: 'Gujarat' },
  { name: 'Jaipur', formatted: 'Jaipur, Rajasthan, India', country: 'India', admin1: 'Rajasthan' },
  { name: 'Chandigarh', formatted: 'Chandigarh, Punjab/Haryana, India', country: 'India', admin1: 'Chandigarh' },
  { name: 'Lucknow', formatted: 'Lucknow, Uttar Pradesh, India', country: 'India', admin1: 'Uttar Pradesh' },

  // Global Hubs
  { name: 'Dubai', formatted: 'Dubai, United Arab Emirates', country: 'United Arab Emirates' },
  { name: 'Abu Dhabi', formatted: 'Abu Dhabi, United Arab Emirates', country: 'United Arab Emirates' },
  { name: 'Singapore', formatted: 'Singapore, Singapore', country: 'Singapore' },
  { name: 'London', formatted: 'London, England, United Kingdom', country: 'United Kingdom' },
  { name: 'New York', formatted: 'New York, NY, USA', country: 'USA' },
  { name: 'San Francisco', formatted: 'San Francisco, CA, USA', country: 'USA' },
  { name: 'Toronto', formatted: 'Toronto, Ontario, Canada', country: 'Canada' },
  { name: 'Sydney', formatted: 'Sydney, NSW, Australia', country: 'Australia' }
];

export async function searchLocations(query: string): Promise<LocationSuggestion[]> {
  const clean = query.trim().toLowerCase();
  if (!clean || clean.length < 2) return [];

  // 1. Instant match in local curated dictionary
  const localMatches = COMMON_PLACES.filter(
    (p) =>
      p.name.toLowerCase().includes(clean) ||
      p.formatted.toLowerCase().includes(clean)
  );

  if (localMatches.length > 0) {
    return localMatches.slice(0, 6);
  }

  // 2. Fallback to Open-Meteo free geocoding API
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        clean
      )}&count=5&language=en&format=json`
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results.map((r: any) => ({
        name: r.name,
        formatted: `${r.name}${r.admin1 ? `, ${r.admin1}` : ''}, ${r.country}`,
        country: r.country,
        admin1: r.admin1
      }));
    }
  } catch (err) {
    console.warn('Geocoding fallback silent skip');
  }

  return [];
}

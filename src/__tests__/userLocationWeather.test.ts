import { describe, it, expect } from 'vitest';
import {
  getUserLocationCoordinates,
  fetchUserCurrentLocationWeather,
  fetchLiveWeather,
  reverseGeocodeCoordinates
} from '../services/openMeteoService';

describe('User Location Real-Time Weather Engine', () => {
  it('resolves user location coordinates without throwing', async () => {
    const loc = await getUserLocationCoordinates();
    expect(loc).toBeDefined();
    expect(typeof loc.latitude).toBe('number');
    expect(typeof loc.longitude).toBe('number');
    expect(typeof loc.cityName).toBe('string');
  });

  it('fetches live weather data for user current location', async () => {
    const weather = await fetchUserCurrentLocationWeather();
    expect(weather).toBeDefined();
    expect(weather.isUserLocation).toBe(true);
    expect(typeof weather.temperature).toBe('number');
    expect(typeof weather.humidity).toBe('number');
    expect(typeof weather.city).toBe('string');
    expect(weather.forecastDaily.length).toBeGreaterThan(0);
  });

  it('fetches live weather for specified coordinates', async () => {
    const weather = await fetchLiveWeather(9.9312, 76.2673, 'Kochi');
    expect(weather.city).toBe('Kochi');
    expect(typeof weather.temperature).toBe('number');
    expect(weather.forecastDaily.length).toBeGreaterThanOrEqual(4);
  });

  it('reverse geocodes coordinates safely', async () => {
    const city = await reverseGeocodeCoordinates(9.9312, 76.2673);
    expect(typeof city).toBe('string');
    expect(city.length).toBeGreaterThan(0);
  });
});

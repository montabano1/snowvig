import { Location } from '../types';

const NOMINATIM_API = 'https://nominatim.openstreetmap.org/search';

export const searchLocations = async (query: string): Promise<Location[]> => {
  if (!query || query.length < 2) return [];

  try {
    // Check if query is a zip code (5 digits)
    const isZipCode = /^\d{5}$/.test(query);
    
    // Use URLSearchParams to properly encode the parameters
    const params = new URLSearchParams({
      format: 'json',
      limit: '5',
      addressdetails: '1',
      countrycodes: 'us',
      ...(isZipCode ? {
        postalcode: query,
      } : {
        q: query
      })
    });

    const url = `${NOMINATIM_API}?${params.toString()}`;
    console.log('Searching locations:', url);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'WeatherApp/1.0'
      }
    });
    
    if (!response.ok) {
      console.warn('Failed to fetch from Nominatim API:', response.statusText);
      return [];
    }

    const data = await response.json();
    console.log('Location search results:', data);

    if (!Array.isArray(data)) {
      console.warn('Unexpected response format from Nominatim API');
      return [];
    }

    return data.map((item: any) => ({
      name: formatLocationName(item),
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon)
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
};

function formatLocationName(item: any): string {
  const address = item.address || {};
  const city = address.city || address.town || address.village || address.municipality;
  const state = address.state;
  
  if (city && state) {
    return `${city}, ${state}`;
  } else if (item.display_name) {
    // Fall back to a simplified version of display_name
    return item.display_name.split(',').slice(0, 2).join(',');
  }
  return item.display_name || 'Unknown Location';
}

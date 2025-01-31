import { Location } from '../types';

const NOMINATIM_API = 'https://nominatim.openstreetmap.org/search';

export const searchLocations = async (query: string): Promise<Location[]> => {
  if (!query || query.length < 2) return [];

  try {
    // Use URLSearchParams to properly encode the parameters
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      limit: '5',
      addressdetails: '1',
    });

    const response = await fetch(`${NOMINATIM_API}?${params.toString()}`);
    
    if (!response.ok) {
      console.warn('Failed to fetch from Nominatim API:', response.statusText);
      return [];
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.warn('Unexpected response format from Nominatim API');
      return [];
    }

    return data.map((item: any) => ({
      name: formatLocationName(item),
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
};

const formatLocationName = (item: any): string => {
  if (!item?.address) {
    return item?.display_name || 'Unknown Location';
  }

  const parts = [];
  
  // Add city/town/village
  if (item.address.city) parts.push(item.address.city);
  else if (item.address.town) parts.push(item.address.town);
  else if (item.address.village) parts.push(item.address.village);
  
  // Add state
  if (item.address.state) parts.push(item.address.state);
  
  // Add country
  if (item.address.country) parts.push(item.address.country);
  
  return parts.length > 0 ? parts.join(', ') : item.display_name || 'Unknown Location';
};

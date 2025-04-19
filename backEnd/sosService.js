const express = require('express');
const axios = require('axios');
const router = express.Router();

// Google API key (use environment variables in production)
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Default location to use when user location is not available
const DEFAULT_LOCATION = { lat: 22.525870, lng: 88.334175 };

// Cache for place details to reduce API calls
const placeDetailsCache = new Map();

// Middleware to parse incoming JSON requests
router.use(express.json());

/**
 * Route to get nearby places with contact information
 * @param {string} type - Type of place (police, pharmacy, etc.)
 * @param {number} radius - Search radius in meters (default: 10000 = 10km)
 */
router.get('/nearby/:type', async (req, res) => {
  try {
    // Get current location from the request or use default
    let lat = req.query.lat ? parseFloat(req.query.lat) : DEFAULT_LOCATION.lat;
    let lng = req.query.lng ? parseFloat(req.query.lng) : DEFAULT_LOCATION.lng;
    
    // Validate coordinates
    if (isNaN(lat) || isNaN(lng)) {
      console.log('Invalid coordinates provided, using default location');
      lat = DEFAULT_LOCATION.lat;
      lng = DEFAULT_LOCATION.lng;
    }

    const location = { lat, lng };
    const type = req.params.type;
    const radius = req.query.radius || 10000; // 10km default
    
    // Map of supported place types
    const placeTypeMappings = {
      'police': ['police'],
      'stations': ['train_station', 'subway_station', 'transit_station'],
      'healthcare': ['pharmacy', 'hospital'],
      'shops': ['store', 'shopping_mall', 'supermarket'],
      'restaurants': ['restaurant', 'cafe']
    };
    
    if (!placeTypeMappings[type]) {
      return res.status(400).json({
        error: 'Invalid place type',
        message: 'Supported types: police, stations, healthcare, shops, restaurants'
      });
    }
    
    // Get places for each type and combine results
    const allResults = [];
    for (const placeType of placeTypeMappings[type]) {
      const places = await fetchNearbyPlaces(location, placeType, radius);
      allResults.push(...places);
    }
    
    // Remove duplicates
    const uniquePlaces = removeDuplicatePlaces(allResults);
    
    // Calculate distance for each place
    const placesWithDistance = calculateDistances(uniquePlaces, location);
    
    // Sort by distance
    const sortedPlaces = placesWithDistance.sort((a, b) => a.distance - b.distance);
    
    // Filter to only include places within 10km
    const placesWithin10km = sortedPlaces.filter(place => place.distance <= 10);
    
    // Get contact information for each place
    const placesWithContacts = await addContactInfo(placesWithin10km);
    
    res.json({
      success: true,
      count: placesWithContacts.length,
      places: placesWithContacts
    });
    
  } catch (error) {
    console.error('Error in nearby places route:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});

/**
 * Fetch nearby places from Google Places API
 */
async function fetchNearbyPlaces(location, type, radius) {
  try {
    // Use the provided location coordinates
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radius}&type=${type}&key=${GOOGLE_API_KEY}`;
    const response = await axios.get(url);
    return response.data.results || [];
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    throw new Error(`Failed to fetch ${type} places: ${error.message}`);
  }
}

/**
 * Remove duplicate places by place_id
 */
function removeDuplicatePlaces(places) {
  return Array.from(
    new Map(places.map(place => [place.place_id, place])).values()
  );
}

/**
 * Calculate distance between current location and each place
 */
function calculateDistances(places, currentLocation) {
  return places.map(place => {
    const distance = calculateHaversineDistance(
      currentLocation.lat,
      currentLocation.lng,
      place.geometry.location.lat,
      place.geometry.location.lng
    );
    return { ...place, distance };
  });
}

/**
 * Calculate distance between two points using Haversine formula
 */
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; // Distance in km
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

/**
 * Add contact information to places
 */
async function addContactInfo(places) {
  const placesWithContacts = [];
  
  for (const place of places) {
    try {
      // Check if we already have the details cached
      if (placeDetailsCache.has(place.place_id)) {
        placesWithContacts.push({
          ...place,
          ...placeDetailsCache.get(place.place_id)
        });
        continue;
      }
      
      // Fetch place details to get phone number
      const details = await getPlaceDetails(place.place_id);
      
      // Add phone number and other details if available
      const contactInfo = {
        phoneNumber: details.formatted_phone_number || null,
        website: details.website || null,
        opening_hours: details.opening_hours || place.opening_hours || null
      };
      
      // Cache the details
      placeDetailsCache.set(place.place_id, contactInfo);
      
      // Only include places with phone numbers
      if (contactInfo.phoneNumber) {
        placesWithContacts.push({
          ...place,
          ...contactInfo
        });
      }
    } catch (error) {
      console.error(`Error getting details for place ${place.name}:`, error);
      // Skip this place if we can't get its details
    }
  }
  
  return placesWithContacts;
}

/**
 * Get details for a specific place
 */
async function getPlaceDetails(placeId) {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number,website,opening_hours&key=${GOOGLE_API_KEY}`;
    
    const response = await axios.get(url);
    
    if (response.data.status === 'OK' && response.data.result) {
      return response.data.result;
    }
    
    throw new Error(`Place details not found for ID: ${placeId}`);
  } catch (error) {
    console.error('Error fetching place details:', error);
    throw error;
  }
}

// Route to get emergency numbers for a specific country
router.get('/emergency-numbers/:country', (req, res) => {
  const country = req.params.country.toLowerCase();
  
  // Default emergency numbers for common countries
  const emergencyNumbers = {
    'us': {
      police: '911',
      ambulance: '911',
      fire: '911'
    },
    'in': {
      police: '100',
      ambulance: '108',
      fire: '101',
      women_helpline: '1091'
    },
    'uk': {
      police: '999',
      ambulance: '999',
      fire: '999'
    },
    'au': {
      police: '000',
      ambulance: '000',
      fire: '000'
    }
  };
  
  // If country is not found, return default international emergency numbers
  const numbers = emergencyNumbers[country] || {
    police: '112',
    ambulance: '112',
    fire: '112'
  };
  
  res.json({
    country: req.params.country,
    emergencyNumbers: numbers
  });
});

// Route to send SMS with location details
router.post('/send-sos', (req, res) => {
  // Get location from request or use default
  let latitude = req.body.latitude;
  let longitude = req.body.longitude;
  
  // If coordinates aren't provided or are invalid, use default
  if (!latitude || !longitude || isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
    latitude = DEFAULT_LOCATION.lat;
    longitude = DEFAULT_LOCATION.lng;
  }
  
  const { phoneNumber, address } = req.body;
  
  // Validate input
  if (!phoneNumber) {
    return res.status(400).json({
      error: 'Missing phone number',
      message: 'A phone number is required to send SOS'
    });
  }
  
  // In a real implementation, you would integrate with an SMS service
  // such as Twilio or a direct carrier API
  // For now, we'll just return the SMS details that would be sentss
  
  const smsContent = {
    to: phoneNumber,
    message: `SOS EMERGENCY: Need immediate assistance at ${address || 'my current location'}. Location coordinates: ${latitude}, ${longitude}. Please help or send emergency services.`
  };
  
  // Log the SMS details (for demonstration)
  console.log('SOS SMS details:', smsContent);
  
  res.json({
    success: true,
    message: 'SOS SMS details prepared',
    smsDetails: smsContent
  });

  Math.floor(Math.random()*90000) + 10000;
});

module.exports = router;
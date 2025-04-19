const express = require('express');
const axios = require('axios');
const router = express.Router();

// Global variable to store latitude and longitude
let currentLocation = { latitude: null, longitude: null };

// Google API key (you should use environment variables in production)
const GOOGLE_API_KEY = 'AIzaSyC0JS_yiIRfQ_CVFFdiQsPxkkpTIxxA_5o';

// Middleware to parse incoming JSON requests
router.use(express.json());

// Endpoint to store the current location
router.post('/saveLocation', (req, res) => {
  const { latitude, longitude } = req.body;

  // Validate the input
  if (!latitude || !longitude) {
    return res.status(400).json({
      error: 'Missing required parameters',
      message: 'Latitude and longitude are required'
    });
  }

  // Update the global location variable
  currentLocation = { latitude, longitude };

  console.log('Location saved:', currentLocation);

  // Respond back with success message
  res.json({
    message: 'Location saved successfully',
    location: currentLocation
  });
});

// Route to retrieve the current stored location
router.get('/getLocation', (req, res) => {
  if (currentLocation.latitude === null || currentLocation.longitude === null) {
    return res.status(404).json({
      error: 'Location not available',
      message: 'No location data has been saved yet.'
    });
  }

  res.json({
    message: 'Current location',
    location: currentLocation
  });
});

// Helper function to fetch nearby places from Google Places API
async function fetchNearbyPlaces(location, type, keyword = '') {
  console.log("I am within the function");
  console.log(location.latitude ,location.longitude);
  try {
    const radius = 5000; // 5km in meters
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=${radius}&key=${GOOGLE_API_KEY}`;
    
    // Add type parameter if provided
    if (type) {
      url += `&type=${type}`;
    }
    
    // Add keyword parameter if provided
    if (keyword) {
      url += `&keyword=${keyword}`;
    }
    
    // Add opennow parameter for restaurants and shops
    if (type === 'restaurant' || type === 'store') {
      url += '&opennow=true';
    }
    
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    throw error;
  }
}

// Calculate distance between two points using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

// Endpoint to get nearby police stations
router.get('/nearbyPoliceStations', async (req, res) => {
  try {
    if (currentLocation.latitude === null || currentLocation.longitude === null) {
      return res.status(404).json({
        error: 'Location not available',
        message: 'No location data has been saved yet.'
      });
    }

    const places = await fetchNearbyPlaces(currentLocation, 'police');
    
    // Calculate distance for each place and sort by distance
    const placesWithDistance = places.map(place => {
      const distance = calculateDistance(
        currentLocation.latitude, 
        currentLocation.longitude, 
        place.geometry.location.lat, 
        place.geometry.location.lng
      );
      return { ...place, distance };
    });
    
    const sortedPlaces = placesWithDistance.sort((a, b) => a.distance - b.distance);
    
    res.json({
      message: 'Nearby police stations',
      places: sortedPlaces
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});

// Endpoint to get nearby stations (train, metro)
router.get('/nearbyStations', async (req, res) => {
  try {
    if (currentLocation.latitude === null || currentLocation.longitude === null) {
      return res.status(404).json({
        error: 'Location not available',
        message: 'No location data has been saved yet.'
      });
    }

    // Fetch train stations and subway/metro stations
    const trainStations = await fetchNearbyPlaces(currentLocation, 'train_station');
    const subwayStations = await fetchNearbyPlaces(currentLocation, 'subway_station');
    const transitStations = await fetchNearbyPlaces(currentLocation, 'transit_station');
    
    // Combine all results
    const allStations = [...trainStations, ...subwayStations, ...transitStations];
    
    // Remove duplicates by place_id
    const uniqueStations = Array.from(
      new Map(allStations.map(station => [station.place_id, station])).values()
    );
    
    // Calculate distance for each place and sort by distance
    const stationsWithDistance = uniqueStations.map(station => {
      const distance = calculateDistance(
        currentLocation.latitude, 
        currentLocation.longitude, 
        station.geometry.location.lat, 
        station.geometry.location.lng
      );
      return { ...station, distance };
    });
    
    const sortedStations = stationsWithDistance.sort((a, b) => a.distance - b.distance);
    
    res.json({
      message: 'Nearby stations',
      places: sortedStations
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});

// Endpoint to get nearby pharmacies and hospitals
router.get('/nearbyPharmacies', async (req, res) => {
  try {
    if (currentLocation.latitude === null || currentLocation.longitude === null) {
      return res.status(404).json({
        error: 'Location not available',
        message: 'No location data has been saved yet.'
      });
    }

    // Fetch pharmacies and hospitals
    const pharmacies = await fetchNearbyPlaces(currentLocation, 'pharmacy');
    const hospitals = await fetchNearbyPlaces(currentLocation, 'hospital');
    
    // Combine all results
    const allHealthcareServices = [...pharmacies, ...hospitals];
    
    // Remove duplicates by place_id
    const uniqueHealthcareServices = Array.from(
      new Map(allHealthcareServices.map(service => [service.place_id, service])).values()
    );
    
    // Calculate distance for each place and sort by distancess
    const servicesWithDistance = uniqueHealthcareServices.map(service => {
      const distance = calculateDistance(
        currentLocation.latitude, 
        currentLocation.longitude, 
        service.geometry.location.lat,
        service.geometry.location.lng
      );
      return { ...service, distance };
    });
    
    const sortedServices = servicesWithDistance.sort((a, b) => a.distance - b.distance);
    
    res.json({
      message: 'Nearby pharmacies and hospitals',
      places: sortedServices
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});

// Endpoint to get nearby shops that are currently open
router.get('/nearbyShops', async (req, res) => {
  try {
    if (currentLocation.latitude === null || currentLocation.longitude === null) {
      return res.status(404).json({
        error: 'Location not available',
        message: 'No location data has been saved yet.'
      });
    }

    const shops = await fetchNearbyPlaces(currentLocation, 'store');
    
    // Calculate distance for each shop and sort by distance
    const shopsWithDistance = shops.map(shop => {
      const distance = calculateDistance(
        currentLocation.latitude, 
        currentLocation.longitude, 
        shop.geometry.location.lat, 
        shop.geometry.location.lng
      );
      return { ...shop, distance };
    });
    
    const sortedShops = shopsWithDistance.sort((a, b) => a.distance - b.distance);
    
    res.json({
      message: 'Nearby shops that are currently open',
      places: sortedShops
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});

// Endpoint to get nearby restaurants that are currently open
router.get('/nearbyRestaurants', async (req, res) => {
  try {
    if (currentLocation.latitude === null || currentLocation.longitude === null) {
      return res.status(404).json({
        error: 'Location not available',
        message: 'No location data has been saved yet.'
      });
    }

    const restaurants = await fetchNearbyPlaces(currentLocation, 'restaurant');
    
    // Calculate distance for each restaurant and sort by distance
    const restaurantsWithDistance = restaurants.map(restaurant => {
      const distance = calculateDistance(
        currentLocation.latitude, 
        currentLocation.longitude, 
        restaurant.geometry.location.lat, 
        restaurant.geometry.location.lng
      );
      return { ...restaurant, distance };
    });
    
    const sortedRestaurants = restaurantsWithDistance.sort((a, b) => a.distance - b.distance);
    
    res.json({
      message: 'Nearby restaurants that are currently open',
      places: sortedRestaurants
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});
// Export the router to be used in index.js
module.exports = router;
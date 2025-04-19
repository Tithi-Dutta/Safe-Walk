const express = require('express');
const axios = require('axios');
const { spawn } = require('child_process');
const router = express.Router();
require('dotenv').config();

// Route to calculate safety score based on location and time
router.post('/calculate', async (req, res) => {
  try {
    const { lat, lng, timeOfDay } = req.body;
    
    if (!lat || !lng || !timeOfDay) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Get Google Maps API key from environment variables (ensure it's set)
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Google Maps API key not configured' });
    }
    
    // 1. Find the nearest police station
    const policeStationData = await findNearestPoliceStation(lat, lng, apiKey);
    
    // 2. Find total number of open places within 1km radius
    const openPlacesData = await findOpenPlaces(lat, lng, apiKey);
    
    // 3. Find distance to nearest highway or main road
    const roadData = await findNearestRoad(lat, lng, apiKey);
    
    // 4. Get address information for display
    const addressData = await getAddressFromCoordinates(lat, lng, apiKey);
    
    // Now we have all the data, use the ML model to predict safety score
    const predictedScore = await predictSafetyScore(
      policeStationData.distance,
      openPlacesData.totalCount,
      openPlacesData.placeTypes,
      roadData.distance,
      timeOfDay
    );
    
    // Send the results back to the client
    res.json({
      address: addressData,
      safetyScore: predictedScore.overallScore,
      policeProximityScore: predictedScore.policeProximityScore,
      policeDistance: policeStationData.distance,
      openPlacesCount: openPlacesData.totalCount,
      openPlacesBreakdown: openPlacesData.placeTypes,
      roadDistance: roadData.distance,
      timeOfDay: timeOfDay
    });
    
  } catch (error) {
    console.error('Error calculating safety score:', error);
    res.status(500).json({ error: 'Error calculating safety score' });
  }
});

// Function to find nearest police station
async function findNearestPoliceStation(lat, lng, apiKey) {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location: `${lat},${lng}`,
        radius: 5000, // 5km radius to ensure we find at least one
        type: 'police',
        key: apiKey
      }
    });
    
    if (response.data.results.length === 0) {
      return { distance: 5.0 }; // Default if no police station found
    }
    
    // Get the nearest police station
    const nearest = response.data.results[0];
    
    // Calculate Euclidean distance (simplified for demo)
    const stationLat = nearest.geometry.location.lat;
    const stationLng = nearest.geometry.location.lng;
    
    // Calculate distance in kilometers
    const distance = calculateEuclideanDistance(lat, lng, stationLat, stationLng);
    
    return {
      distance: distance,
      name: nearest.name,
      location: nearest.geometry.location
    };
  } catch (error) {
    console.error('Error finding nearest police station:', error);
    return { distance: 5.0 }; // Default if error
  }
}

// Function to find open places within 1km radius
async function findOpenPlaces(lat, lng, apiKey) {
  // Array of place types to check
  const placeTypes = [
    'subway_station', 'train_station', 'hospital', 'pharmacy', 
    'shopping_mall', 'restaurant', 'cafe', 'convenience_store'
  ];
  
  const placeResults = {};
  let totalCount = 0;
  
  try {
    // For each place type, make a request to Google Places API
    for (const type of placeTypes) {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
        params: {
          location: `${lat},${lng}`,
          radius: 1000, // 1km radius
          type: type,
          key: apiKey
        }
      });
      
      placeResults[type] = response.data.results.length;
      totalCount += response.data.results.length;
    }
    
    return {
      totalCount: totalCount,
      placeTypes: placeResults
    };
  } catch (error) {
    console.error('Error finding open places:', error);
    return { totalCount: 0, placeTypes: {} };
  }
}

// Function to find nearest highway or main road
async function findNearestRoad(lat, lng, apiKey) {
  try {
    // Use the Roads API to find the nearest road
    const response = await axios.get('https://roads.googleapis.com/v1/nearestRoads', {
      params: {
        points: `${lat},${lng}`,
        key: apiKey
      }
    });
    
    if (!response.data.snappedPoints || response.data.snappedPoints.length === 0) {
      // If no road found, use Places API as fallback
      return findNearestRoadAlternative(lat, lng, apiKey);
    }
    
    const nearestPoint = response.data.snappedPoints[0];
    const roadLat = nearestPoint.location.latitude;
    const roadLng = nearestPoint.location.longitude;
    
    // Calculate distance in kilometers
    const distance = calculateEuclideanDistance(lat, lng, roadLat, roadLng);
    
    return { distance: distance };
  } catch (error) {
    console.error('Error finding nearest road:', error);
    return findNearestRoadAlternative(lat, lng, apiKey);
  }
}

// Alternative method to find nearest road using Places API
async function findNearestRoadAlternative(lat, lng, apiKey) {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location: `${lat},${lng}`,
        radius: 1000, // 1km radius
        type: 'route',
        key: apiKey
      }
    });
    
    if (response.data.results.length === 0) {
      return { distance: 0.5 }; // Default if no road found
    }
    
    // Get the nearest road
    const nearest = response.data.results[0];
    const roadLat = nearest.geometry.location.lat;
    const roadLng = nearest.geometry.location.lng;
    
    // Calculate distance in kilometers
    const distance = calculateEuclideanDistance(lat, lng, roadLat, roadLng);
    
    return { distance: distance };
  } catch (error) {
    console.error('Error in alternative road finding:', error);
    return { distance: 0.5 }; // Default if error
  }
}

// Function to get address from coordinates
async function getAddressFromCoordinates(lat, lng, apiKey) {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        latlng: `${lat},${lng}`,
        key: apiKey
      }
    });
    
    if (response.data.results.length === 0) {
      return `Location (${lat.toFixed(6)}, ${lng.toFixed(6)})`;
    }
    
    return response.data.results[0].formatted_address;
  } catch (error) {
    console.error('Error getting address:', error);
    return `Location (${lat.toFixed(6)}, ${lng.toFixed(6)})`;
  }
}

// Function to calculate Euclidean distance between two points
function calculateEuclideanDistance(lat1, lng1, lat2, lng2) {
  // Earth's radius in kilometers
  const R = 6371;
  
  // Convert latitude and longitude from degrees to radians
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  
  // Haversine formula
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
}

// Function to predict safety score using Python ML model
async function predictSafetyScore(policeDistance, openPlacesCount, placeTypes, roadDistance, timeOfDay) {
  return new Promise((resolve, reject) => {
    // Create human gathering score based on place types
    let humanGatheringScore = 0;
    
    // Weights for different place types (higher = more human gathering)
    const placeTypeWeights = {
      'subway_station': 10,
      'train_station': 10,
      'hospital': 8,
      'shopping_mall': 7,
      'restaurant': 6,
      'cafe': 5,
      'pharmacy': 4,
      'convenience_store': 3
    };
    
    // Calculate human gathering score
    for (const [placeType, count] of Object.entries(placeTypes)) {
      humanGatheringScore += (count * (placeTypeWeights[placeType] || 1));
    }
    
    // Spawn Python process
    const pythonProcess = spawn('python', ['model.py', 
      policeDistance.toString(),
      openPlacesCount.toString(),
      humanGatheringScore.toString(),
      roadDistance.toString(),
      timeOfDay === 'day' ? '1' : '0' // 1 for day, 0 for night
    ]);
    
    let pythonData = '';
    let pythonError = '';
    
    pythonProcess.stdout.on('data', (data) => {
      pythonData += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      pythonError += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        console.error(pythonError);
        
        // Fallback scoring if Python fails
        resolve(calculateFallbackScore(policeDistance, openPlacesCount, humanGatheringScore, roadDistance, timeOfDay));
      } else {
        try {
          const result = JSON.parse(pythonData);
          resolve(result);
        } catch (error) {
          console.error('Error parsing Python output:', error);
          resolve(calculateFallbackScore(policeDistance, openPlacesCount, humanGatheringScore, roadDistance, timeOfDay));
        }
      }
    });
  });
}

// Fallback scoring function in case the Python model fails
function calculateFallbackScore(policeDistance, openPlacesCount, humanGatheringScore, roadDistance, timeOfDay) {
  // Weights for each factor
  const weights = {
    police: 0.45,      // 45% weight
    openPlaces: 0.25,  // 25% weight
    road: 0.20,        // 20% weight
    time: 0.10         // 10% weight
  };
  
  // Police proximity score (inverse - closer is better)
  let policeProximityScore = Math.max(0, Math.min(100, 100 - (policeDistance * 20)));
  
// Open places score (more is better)
  let openPlacesScore = Math.min(100, (openPlacesCount * 5) + (humanGatheringScore / 10));
  
  // Road proximity score (inverse - closer is better, but not too close)
  let roadProximityScore;
  if (roadDistance < 0.05) {
    // Too close to road (less than 50m) - reduce score
    roadProximityScore = 50;
  } else if (roadDistance > 1.0) {
    // Too far from road (more than 1km) - reduce score
    roadProximityScore = 60;
  } else {
    // Optimal distance
    roadProximityScore = 100 - Math.abs(0.3 - roadDistance) * 100;
  }
  
  // Time of day score
  const timeScore = timeOfDay === 'day' ? 100 : 50;
  
  // Calculate overall score (weighted average)
  const overallScore = (
    (policeProximityScore * weights.police) +
    (openPlacesScore * weights.openPlaces) +
    (roadProximityScore * weights.road) +
    (timeScore * weights.time)
  ) / 10; // Convert to a 0-10 scale
  
  return {
    overallScore: Math.min(10, Math.max(0, Math.round(overallScore * 10) / 10)),
    policeProximityScore: Math.round(policeProximityScore)
  };
}

module.exports = router;
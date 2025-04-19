let map;
let marker;
let searchBox;

// Initialize the map
function initMap() {
  // Default location (center of map)
  const defaultLocation = { lat: 40.7128, lng: -74.0060 }; // New York

  // Create map
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 13,
    mapTypeControl: false,
  });

  // Create search box
  const input = document.getElementById("search-location");
  searchBox = new google.maps.places.SearchBox(input);
  
  // Bias the SearchBox results towards current map's viewport
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  // Listen for the event when a user selects a prediction
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length === 0) {
      return;
    }

    // For each place, get the location
    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      // Update the marker position
      if (marker) {
        marker.setMap(null);
      }
      
      marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
        draggable: true,
      });

      // Update form values
      updateSelectedLocation(place.geometry.location);

      // Pan to the selected location
      map.panTo(place.geometry.location);
      map.setZoom(15);
    });
  });

  // Add click listener to the map
  map.addListener("click", (event) => {
    // Update the marker position
    if (marker) {
      marker.setMap(null);
    }
    
    marker = new google.maps.Marker({
      position: event.latLng,
      map: map,
      draggable: true,
    });

    // Update form values
    updateSelectedLocation(event.latLng);
  });

  // Add dragend listener to the marker
  if (marker) {
    marker.addListener("dragend", () => {
      updateSelectedLocation(marker.getPosition());
    });
  }
}

// Update the form with selected location details
function updateSelectedLocation(location) {
  const lat = location.lat();
  const lng = location.lng();
  
  document.getElementById("lat").value = lat;
  document.getElementById("lng").value = lng;
  
  // Reverse geocode to get the address
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ location: { lat, lng } }, (results, status) => {
    if (status === "OK" && results[0]) {
      document.getElementById("selected-location").value = results[0].formatted_address;
    } else {
      document.getElementById("selected-location").value = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
    }
  });
}

// Submit the form data to get safety score
function checkSafetyScore() {
  const lat = document.getElementById("lat").value;
  const lng = document.getElementById("lng").value;
  const timeOfDay = document.getElementById("time-select").value;
  
  if (!lat || !lng) {
    alert("Please select a location on the map first.");
    return;
  }
  
  // Prepare data to send to the server
  const data = {
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    timeOfDay: timeOfDay
  };
  
  // Send data to the server
  fetch('/location/calculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
    // Store the response data in sessionStorage
    sessionStorage.setItem('safetyData', JSON.stringify(data));
    
    // Redirect to safety_score.html
    window.location.href = 'safety_score.html';
  })
  .catch((error) => {
    console.error('Error:', error);
    alert('An error occurred while calculating the safety score.');
  });
}

// Add event listener to the check safety button
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the map
  initMap();
  
  // Add event listener to the button
  document.getElementById('check-safety').addEventListener('click', checkSafetyScore);
});
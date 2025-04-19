#!/usr/bin/env python
import sys
import json
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.ensemble import RandomForestRegressor

def predict_safety_score(police_distance, open_places_count, human_gathering_score, road_distance, is_day):
    """
    Predict safety score using a machine learning model.
    
    Parameters:
    - police_distance: Euclidean distance to nearest police station (km)
    - open_places_count: Number of open places within 1km radius
    - human_gathering_score: Score based on types of places nearby
    - road_distance: Euclidean distance to nearest main road (km)
    - is_day: Boolean (1 for day, 0 for night)
    
    Returns:
    - Dictionary with safety scores
    """
    # Convert inputs to float
    police_distance = float(police_distance)
    open_places_count = float(open_places_count)
    human_gathering_score = float(human_gathering_score)
    road_distance = float(road_distance)
    is_day = int(is_day)
    
    # Feature vector
    X = np.array([[police_distance, open_places_count, human_gathering_score, road_distance, is_day]])
    
    # In a real-world scenario, we would load a pre-trained model here
    # For now, we'll create a simple model based on the given weights and constraints
    
    # Normalize features
    scaler = MinMaxScaler()
    
    # Create synthetic training data based on domain knowledge
    # This simulates a trained model with our specified rules
    X_train = np.array([
        # [police_dist, open_places, human_gather, road_dist, is_day]
        [0.1, 20, 100, 0.3, 1],   # Very safe location
        [0.2, 15, 80, 0.2, 1],    # Safe location
        [0.5, 10, 60, 0.5, 1],    # Moderately safe location (day)
        [0.5, 10, 60, 0.5, 0],    # Less safe location (night)
        [1.0, 5, 30, 0.8, 1],     # Less safe location
        [2.0, 3, 15, 0.1, 0],     # Unsafe location
        [3.0, 2, 10, 1.5, 0],     # Very unsafe location
        [5.0, 0, 0, 2.0, 0],      # Extremely unsafe location
    ])
    
    # Corresponding safety scores (0-10 scale)
    y_train = np.array([9.5, 8.5, 7.0, 5.5, 5.0, 3.5, 2.0, 1.0])
    
    # Fit scaler with training data
    scaler.fit(X_train)
    
    # Scale input features
    X_scaled = scaler.transform(X)
    X_train_scaled = scaler.transform(X_train)
    
    # Train a Random Forest model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Predict the safety score
    safety_score = model.predict(X_scaled)[0]
    
    # Calculate feature importances
    feature_importances = model.feature_importances_
    
    # Calculate police proximity score (normalized, inversely proportional to distance)
    max_police_distance = 5.0  # km
    police_proximity_score = max(0, min(100, 100 - (police_distance / max_police_distance * 100)))
    
    # Ensure safety score is in 0-10 range
    safety_score = max(0, min(10, safety_score))
    
    # Round to one decimal place
    safety_score = round(safety_score, 1)
    
    result = {
        "overallScore": safety_score,
        "policeProximityScore": round(police_proximity_score),
        "featureImportances": {
            "policeDistance": float(feature_importances[0]),
            "openPlacesCount": float(feature_importances[1]),
            "humanGatheringScore": float(feature_importances[2]),
            "roadDistance": float(feature_importances[3]),
            "isDay": float(feature_importances[4])
        }
    }
    
    return result

if __name__ == "__main__":
    # Get command line arguments
    if len(sys.argv) != 6:
        print("Usage: python model.py police_distance open_places_count human_gathering_score road_distance is_day")
        sys.exit(1)
    
    police_distance = sys.argv[1]
    open_places_count = sys.argv[2]
    human_gathering_score = sys.argv[3]
    road_distance = sys.argv[4]
    is_day = sys.argv[5]
    
    result = predict_safety_score(police_distance, open_places_count, human_gathering_score, road_distance, is_day)
    
    # Print JSON result
    print(json.dumps(result))
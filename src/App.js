import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import './App.css';

const mapContainerStyle = {
  width: '100%',
  height: '70vh'
};

const center = { lat: 0, lng: 0 };

const interpolateCoordinates = (start, end, steps) => {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const lat = start.lat + (end.lat - start.lat) * (i / steps);
    const lng = start.lng + (end.lng - start.lng) * (i / steps);
    points.push({ lat, lng });
  }
  return points;
};

function App() {
  const [path, setPath] = useState([]);
  const [input, setInput] = useState('');
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const fileInputRef = useRef(null);
  const simulationRef = useRef(null);

  const handleAddCoordinate = () => {
    const [lat, lng, timestamp] = input.split(',').map(Number);
    if (!isNaN(lat) && !isNaN(lng) && !isNaN(timestamp)) {
      setPath(prevPath => [...prevPath, { lat, lng, timestamp }]);
      setInput('');
    } else {
      alert('Please enter valid latitude, longitude, and timestamp');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const fileCoordinates = content.split('\n').map(line => {
          const [lat, lng, timestamp] = line.split(',').map(Number);
          return { lat, lng, timestamp };
        }).filter(coord => !isNaN(coord.lat) && !isNaN(coord.lng) && !isNaN(coord.timestamp));
        setPath(fileCoordinates);
      };
      reader.readAsText(file);
    }
  };

  const simulate = useCallback(() => {
    if (currentIndex >= path.length - 1) {
      setIsSimulating(false);
      setIsPaused(false);
      return;
    }

    const totalSteps = 100;
    const stepDuration = 50;

    const start = path[currentIndex];
    const end = path[currentIndex + 1];
    const interpolated = interpolateCoordinates(start, end, totalSteps);

    const moveStep = () => {
      if (currentStep < interpolated.length) {
        setCurrentPosition(interpolated[currentStep]);
        setCurrentStep(prev => prev + 1);
      } else {
        setCurrentIndex(prev => prev + 1);
        setCurrentStep(0);
      }
    };

    simulationRef.current = setInterval(moveStep, stepDuration);
  }, [currentIndex, path, currentStep]);

  useEffect(() => {
    if (isSimulating && !isPaused) {
      simulate();
    }
    return () => clearInterval(simulationRef.current);
  }, [isSimulating, isPaused, simulate]);

  const startSimulation = () => {
    setIsSimulating(true);
    setIsPaused(false);
    if (currentIndex === 0) {
      setCurrentPosition(path[0]);
    }
  };

  const pauseSimulation = () => {
    setIsPaused(true);
    clearInterval(simulationRef.current);
  };

  const resumeSimulation = () => {
    setIsPaused(false);
  };

  return (
    <div className="App">
      <h1>Drone Simulator</h1>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={3}
        >
          {currentPosition && <Marker position={currentPosition} />}
          {path.length > 1 && (
            <Polyline
              path={path}
              options={{
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
      <div className="controls">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter latitude,longitude,timestamp"
        />
        <button onClick={handleAddCoordinate}>Add Coordinate</button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileUpload}
          accept=".csv,.txt"
        />
        <button onClick={() => fileInputRef.current.click()}>Upload File</button>
        <button onClick={startSimulation} disabled={isSimulating || path.length === 0}>Simulate</button>
        <button onClick={pauseSimulation} disabled={!isSimulating || isPaused}>Pause</button>
        <button onClick={resumeSimulation} disabled={!isPaused}>Resume</button>
      </div>
    </div>
  );
}

export default App;

# Drone Simulator:

Drone Simulator is a React-based web application that visualizes drone movement on Google Maps based on user-provided coordinate data. This interactive tool allows users to input or upload time-series data of latitude and longitude coordinates, simulating a drone's flight path on a world map.

## Features
- Interactive Google Maps display
- Manual coordinate input (latitude, longitude, timestamp)
- File upload support for coordinate data (.csv or .txt)
- Real-time drone movement simulation
- Path visualization with polylines
- Pause and resume simulation functionality

## Prerequisites
Node.js
npm (Node Package Manager)
Google Maps API Key

## Usage:
1. Enter coordinates manually in the format: latitude,longitude,timestamp
2. Click "Add Coordinate" to add the point to the path
3. Alternatively, upload a CSV or TXT file with coordinate data
4. Click "Simulate" to start the drone movement
5. Use "Pause" and "Resume" to control the simulation

## File Format for Upload:
The application accepts .csv or .txt files with the following format:
latitude1,longitude1,timestamp1
latitude2,longitude2,timestamp2
example:
28.6139,77.2090,1689418800
28.5169,77.3034,1689419100

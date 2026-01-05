import { useState, useEffect } from 'react';
import MapView from './components/MapView';
import TimeSeriesChart from './components/TimeSeriesChart';
import axios from 'axios';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [timeSeriesData, setTimeSeriesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Fetch all profiles on component mount
  useEffect(() => {
    fetchProfiles();
    
    // Auto-refresh every 60 seconds (1 minute)
    const interval = setInterval(() => {
      fetchProfiles();
    }, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching profiles from:', `${API_URL}/api/profiles`);
      
      // Start timing
      const startTime = Date.now();
      
      const response = await axios.get(`${API_URL}/api/profiles`);
      console.log('Profiles received:', response.data.data.length);
      console.log('First profile:', response.data.data[0]);
      
      // Calculate elapsed time and ensure minimum 2 seconds loading
      const elapsedTime = Date.now() - startTime;
      const minimumLoadingTime = 2000; // 2 seconds
      const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);
      
      // Wait for remaining time if needed
      await new Promise(resolve => setTimeout(resolve, remainingTime));
      
      setProfiles(response.data.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch profiles. Please check if the backend is running.');
      console.error('Error fetching profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  // Fetch time series data when a profile is selected
  const handleProfileClick = async (profileId) => {
    try {
      const response = await axios.get(`${API_URL}/api/profiles/${profileId}/timeseries`);
      setTimeSeriesData(response.data);
      setSelectedProfile(profileId);
    } catch (err) {
      console.error('Error fetching time series:', err);
      alert('Failed to fetch time series data');
    }
  };

  const handleCloseChart = () => {
    setSelectedProfile(null);
    setTimeSeriesData(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌦️ Weather Dashboard - Sri Lanka</h1>
        <p>Click on any marker to view detailed weather data</p>
      </header>

      <main className="app-main">
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading weather profiles...</p>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <p>⚠️ {error}</p>
            <button onClick={fetchProfiles}>Retry</button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="map-container">
              {profiles.length > 0 ? (
                <MapView 
                  key={profiles.length}
                  profiles={profiles} 
                  onProfileClick={handleProfileClick}
                  selectedProfile={selectedProfile}
                />
              ) : (
                <div className="loading">
                  <p>No profiles found. Please check the database.</p>
                </div>
              )}
            </div>

            {timeSeriesData && (
              <div className="chart-overlay">
                <div className="chart-container">
                  <div className="chart-header">
                    <h2>📊 {timeSeriesData.profileName}</h2>
                    <button className="close-btn" onClick={handleCloseChart}>✕</button>
                  </div>
                  <TimeSeriesChart data={timeSeriesData} />
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <div className="status-bar">
        <div className="status-item active-profiles">
          <span className="status-label">ACTIVE PROFILES</span>
          <span className="status-value">{profiles.length}</span>
        </div>
        <div className="status-item last-updated">
          <span className="status-label">LAST UPDATED</span>
          <span className="status-value">{formatTime(lastUpdated)}</span>
        </div>
      </div>
    </div>
  );
}

export default App;

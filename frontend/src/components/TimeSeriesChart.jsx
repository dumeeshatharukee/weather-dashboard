import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './TimeSeriesChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function TimeSeriesChart({ data }) {
  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="no-data">
        <p>No time series data available for this profile.</p>
      </div>
    );
  }

  const timeSeriesData = data.data;
  const sensors = data.sensors || [];

  // Generate colors for each sensor
  const colors = [
    { border: 'rgb(255, 99, 132)', background: 'rgba(255, 99, 132, 0.2)' },
    { border: 'rgb(54, 162, 235)', background: 'rgba(54, 162, 235, 0.2)' },
    { border: 'rgb(255, 206, 86)', background: 'rgba(255, 206, 86, 0.2)' },
    { border: 'rgb(75, 192, 192)', background: 'rgba(75, 192, 192, 0.2)' },
    { border: 'rgb(153, 102, 255)', background: 'rgba(153, 102, 255, 0.2)' },
    { border: 'rgb(255, 159, 64)', background: 'rgba(255, 159, 64, 0.2)' },
  ];

  // Prepare labels (timestamps)
  const labels = timeSeriesData.map(item => {
    const timestamp = item.timestamp || item.date;
    if (timestamp) {
      return new Date(timestamp).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return 'N/A';
  });

  // Create datasets for each sensor with proper labels
  const sensorLabels = {
    'temperature': 'Temperature (°C)',
    'humidity': 'Humidity (%)',
    'pressure': 'Pressure (Pa)',
    'percentage_light_intensity': 'Light Intensity (%)',
    'precipitation': 'Precipitation',
    'wind_speed': 'Wind Speed',
    'rainfall': 'Rainfall'
  };

  const datasets = sensors.map((sensor, index) => ({
    label: sensorLabels[sensor] || sensor.charAt(0).toUpperCase() + sensor.slice(1).replace(/_/g, ' '),
    data: timeSeriesData.map(item => item[sensor]),
    borderColor: colors[index % colors.length].border,
    backgroundColor: colors[index % colors.length].background,
    tension: 0.4,
    fill: true,
    pointRadius: 3,
    pointHoverRadius: 6
  }));

  const chartData = {
    labels,
    datasets
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Sensor Values',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div className="time-series-chart">
      <div className="chart-info">
        <div className="info-item">
          <span className="label">Data Points:</span>
          <span className="value">{data.dataPoints}</span>
        </div>
        <div className="info-item">
          <span className="label">Sensors:</span>
          <span className="value">{sensors.join(', ')}</span>
        </div>
      </div>

      <div className="chart-wrapper">
        <Line data={chartData} options={options} />
      </div>

      {timeSeriesData.length > 0 && (
        <div className="data-summary">
          <h3>Data Summary</h3>
          <div className="summary-grid">
            {sensors.map(sensor => {
              const values = timeSeriesData.map(item => item[sensor]).filter(v => v != null);
              if (values.length === 0) return null;
              
              const min = Math.min(...values);
              const max = Math.max(...values);
              const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);

              const sensorLabels = {
                'temperature': 'Temperature',
                'humidity': 'Humidity',
                'pressure': 'Pressure',
                'percentage_light_intensity': 'Light Intensity',
                'precipitation': 'Precipitation',
                'wind_speed': 'Wind Speed',
                'rainfall': 'Rainfall'
              };

              const sensorUnits = {
                'temperature': '°C',
                'humidity': '%',
                'pressure': 'Pa',
                'percentage_light_intensity': '%',
                'precipitation': 'mm',
                'wind_speed': 'm/s',
                'rainfall': 'mm'
              };

              const label = sensorLabels[sensor] || sensor.charAt(0).toUpperCase() + sensor.slice(1).replace(/_/g, ' ');
              const unit = sensorUnits[sensor] || '';

              return (
                <div key={sensor} className="summary-card">
                  <h4>{label}</h4>
                  <p>Min: <strong>{min.toFixed(2)} {unit}</strong></p>
                  <p>Max: <strong>{max.toFixed(2)} {unit}</strong></p>
                  <p>Avg: <strong>{avg} {unit}</strong></p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default TimeSeriesChart;

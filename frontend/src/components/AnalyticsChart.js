import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Spinner from 'react-spinners/PulseLoader';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsChart = ({ shortId }) => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/analytics/${shortId}`);
        setAnalytics(res.data);
      } catch (err) {
        toast.error('Error fetching analytics data');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [shortId]);

  const clicksByDate = analytics.reduce((acc, click) => {
    const date = new Date(click.timestamp).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const devices = analytics.reduce((acc, click) => {
    const device = click.device || 'Unknown';
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {});

  const browsers = analytics.reduce((acc, click) => {
    const browser = click.browser || 'Unknown';
    acc[browser] = (acc[browser] || 0) + 1;
    return acc;
  }, {});

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
  };

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold text-gray-800">Analytics for {shortId}</h3>
      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner color="#2563eb" />
        </div>
      ) : analytics.length === 0 ? (
        <p className="text-gray-500 text-center">No analytics data available.</p>
      ) : (
        <div className="space-y-8">
          <div>
            <h4 className="text-lg font-medium text-gray-700 mb-4">Clicks Over Time</h4>
            <Bar
              data={{
                labels: Object.keys(clicksByDate),
                datasets: [
                  {
                    label: 'Clicks Over Time',
                    data: Object.values(clicksByDate),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                ...options,
                plugins: { ...options.plugins, title: { display: true, text: 'Clicks Over Time' } },
              }}
            />
          </div>
          <div>
            <h4 className="text-lg font-medium text-gray-700 mb-4">Device Distribution</h4>
            <Bar
              data={{
                labels: Object.keys(devices),
                datasets: [
                  {
                    label: 'Device Distribution',
                    data: Object.values(devices),
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.6)',
                      'rgba(54, 162, 235, 0.6)',
                      'rgba(255, 206, 86, 0.6)',
                      'rgba(75, 192, 192, 0.6)',
                    ],
                    borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                ...options,
                plugins: { ...options.plugins, title: { display: true, text: 'Device Distribution' } },
              }}
            />
          </div>
          <div>
            <h4 className="text-lg font-medium text-gray-700 mb-4">Browser Distribution</h4>
            <Bar
              data={{
                labels: Object.keys(browsers),
                datasets: [
                  {
                    label: 'Browser Distribution',
                    data: Object.values(browsers),
                    backgroundColor: [
                      'rgba(153, 102, 255, 0.6)',
                      'rgba(255, 159, 64, 0.6)',
                      'rgba(75, 192, 192, 0.6)',
                      'rgba(255, 99, 132, 0.6)',
                    ],
                    borderColor: [
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(255, 99, 132, 1)',
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                ...options,
                plugins: { ...options.plugins, title: { display: true, text: 'Browser Distribution' } },
              }}
            />
          </div>
          <div>
            <h4 className="text-lg font-medium text-gray-700 mb-4">Summary</h4>
            <p className="text-gray-600">Total Clicks: {analytics.length}</p>
            <p className="text-gray-600">Unique IPs: {new Set(analytics.map(click => click.ip)).size}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsChart;
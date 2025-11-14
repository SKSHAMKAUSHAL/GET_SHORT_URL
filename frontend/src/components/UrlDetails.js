import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import Spinner from 'react-spinners/PulseLoader';
import { AuthContext } from '../context/AuthContext';
import AnalyticsChart from './AnalyticsChart';

const UrlDetails = () => {
  const { shortId } = useParams();
  const [url, setUrl] = useState(null);
  const [editUrl, setEditUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUrl = async () => {
      setLoading(true);
      console.log(`[Frontend] Fetching URL details for shortId: ${shortId}`);
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/user/urls/${shortId}`);
        console.log(`[Frontend] URL fetched:`, res.data);
        setUrl(res.data);
        setEditUrl(res.data.originalUrl);
      } catch (err) {
        console.error(`[Frontend] Error fetching URL details:`, err);
        if (err.response?.status === 401) {
          toast.error('Session expired, please log in again');
          logout();
          navigate('/login');
        } else {
          toast.error('Error fetching URL details');
          navigate('/dashboard');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUrl();
  }, [shortId, logout, navigate]);

  const handleUpdate = async () => {
    if (!editUrl) {
      console.warn('[Frontend] Update URL attempted with empty input');
      return toast.error('Enter a URL to update');
    }
    console.log(`[Frontend] Updating URL for shortId: ${shortId}, new URL: ${editUrl}`);
    try {
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/${shortId}`, { originalUrl: editUrl });
      console.log(`[Frontend] URL updated successfully:`, res.data);
      setUrl({ ...url, originalUrl: editUrl });
      const cacheKey = `url:${shortId}`;
      await axios.delete(`${process.env.REACT_APP_API_URL}/cache/${cacheKey}`);
      console.log(`[Frontend] Cache cleared for key: ${cacheKey}`);
      toast.success('URL updated');
    } catch (err) {
      console.error(`[Frontend] Error updating URL:`, err);
      if (err.response?.status === 401) {
        toast.error('Session expired, please log in again');
        logout();
        navigate('/login');
      } else {
        toast.error('Error updating URL');
      }
    }
  };

  const handleDelete = async () => {
    console.log(`[Frontend] Deleting URL for shortId: ${shortId}`);
    try {
      const res = await axios.delete(`${process.env.REACT_APP_API_URL}/${shortId}`);
      console.log(`[Frontend] URL deleted successfully:`, res.data);
      const cacheKey = `url:${shortId}`;
      await axios.delete(`${process.env.REACT_APP_API_URL}/cache/${cacheKey}`);
      console.log(`[Frontend] Cache cleared for key: ${cacheKey}`);
      toast.success('URL deleted');
      navigate('/dashboard');
    } catch (err) {
      console.error(`[Frontend] Error deleting URL:`, err);
      if (err.response?.status === 401) {
        toast.error('Session expired, please log in again');
        logout();
        navigate('/login');
      } else {
        toast.error('Error deleting URL');
      }
    }
  };

  const handleToggleStatus = async () => {
    const isCurrentlyActive = url.active;
    console.log(`[Frontend] Toggling status for shortId: ${shortId}, currentState: ${isCurrentlyActive ? 'active' : 'inactive'}, action: ${isCurrentlyActive ? 'deactivate' : 'activate'}`);
    try {
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/${shortId}/toggle-status`, { active: 'toggle' });
      console.log(`[Frontend] Status toggled successfully:`, res.data);
      setUrl(res.data);
      const cacheKey = `url:${shortId}`;
      await axios.delete(`${process.env.REACT_APP_API_URL}/cache/${cacheKey}`);
      console.log(`[Frontend] Cache cleared for key: ${cacheKey}`);
      const refreshRes = await axios.get(`${process.env.REACT_APP_API_URL}/user/urls/${shortId}`);
      console.log(`[Frontend] URL refreshed after toggle:`, refreshRes.data);
      setUrl(refreshRes.data);
      toast.success(`URL ${isCurrentlyActive ? 'deactivated' : 'activated'}`);
    } catch (err) {
      console.error(`[Frontend] Error toggling status:`, err);
      if (err.response?.status === 401) {
        toast.error('Session expired, please log in again');
        logout();
        navigate('/login');
      } else {
        toast.error('Error updating status');
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy');
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-center">
          <Spinner color="#2563eb" />
          <p className="mt-4 text-gray-600">Loading URL details...</p>
        </div>
      </div>
    );
  }

  if (!url) {
    console.warn(`[Frontend] No URL data available for shortId: ${shortId}, redirecting to dashboard`);
    return <Navigate to="/dashboard" />;
  }

  const shortUrl = `${process.env.REACT_APP_API_URL}/${url.shortId}`;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center sm:text-left">URL Details</h1>
            <p className="text-gray-500 mt-2 text-center sm:text-left">Manage your shortened URL</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200 mt-4 sm:mt-0"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
          {/* URL Information */}
          <div className="space-y-6">
            {/* Short URL with Copy Button */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Short URL</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline break-all"
                  >
                    {shortUrl}
                  </a>
                </div>
                <button
                  onClick={() => copyToClipboard(shortUrl)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200 whitespace-nowrap"
                >
                  Copy URL
                </button>
              </div>
            </div>

            {/* Original URL */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Original URL</h3>
              <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                <a
                  href={url.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:underline break-all"
                >
                  {url.originalUrl}
                </a>
              </div>
            </div>

            {/* Stats and QR Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stats */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border border-gray-300 rounded-lg">
                    <span className="text-gray-600">Total Clicks</span>
                    <span className="font-bold text-gray-800">{url.clicks.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-gray-300 rounded-lg">
                    <span className="text-gray-600">Status</span>
                    <span className={`font-semibold ${url.active ? 'text-green-500' : 'text-red-500'}`}>
                      {url.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-gray-300 rounded-lg">
                    <span className="text-gray-600">Created</span>
                    <span className="text-gray-800">{new Date(url.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">QR Code</h3>
                <div className="flex justify-center p-4 border border-gray-300 rounded-lg bg-white">
                  <QRCodeCanvas
                    value={shortUrl}
                    size={120}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="M"
                  />
                </div>
                <button
                  onClick={() => copyToClipboard(shortUrl)}
                  className="w-full mt-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200"
                >
                  Copy QR Code URL
                </button>
              </div>
            </div>

            {/* Edit URL */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit URL</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Enter new destination URL"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
                <button
                  onClick={handleUpdate}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow transition duration-200 whitespace-nowrap"
                >
                  Update URL
                </button>
              </div>
            </div>

            {/* Status Management */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Management</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <button
                  onClick={handleToggleStatus}
                  className={`font-semibold py-3 px-6 rounded-lg shadow transition duration-200 ${
                    url.active 
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {url.active ? 'Deactivate URL' : 'Activate URL'}
                </button>
                <p className="text-gray-600 text-sm flex-1">
                  {url.active 
                    ? 'Pause this URL to temporarily stop redirection' 
                    : 'Activate this URL to resume redirection'}
                </p>
              </div>
            </div>

            {/* Delete URL */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Delete URL</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow transition duration-200"
                >
                  Delete URL
                </button>
                <p className="text-gray-600 text-sm flex-1">
                  Permanently delete this URL and all its analytics data. This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Analytics */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Analytics</h3>
              <AnalyticsChart shortId={shortId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlDetails;
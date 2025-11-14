import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import UrlShortener from './UrlShortener';
import Spinner from 'react-spinners/PulseLoader';
import { AuthContext } from '../context/AuthContext';
import { QRCodeCanvas } from 'qrcode.react';

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchUrls = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/user/urls`);
      console.log('[Frontend] User URLs fetched:', res.data);
      setUrls(res.data);
    } catch (err) {
      console.error('[Frontend] Error fetching user URLs:', err);
      if (err.response?.status === 401) {
        toast.error('Session expired, please log in again');
        logout();
        window.location.href = '/login';
      } else {
        toast.error('Error fetching URLs');
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  const handleMoreInfo = (shortId) => {
    console.log(`[Frontend] Navigating to URL details for shortId: ${shortId}`);
    navigate(`/url/${shortId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header - More Compact */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your shortened URLs</p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <span className="text-sm text-gray-600 hidden sm:block">Welcome back!</span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg shadow transition duration-200 text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* URL Shortener - Now with side-by-side layout */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-6">
          <UrlShortener onShorten={fetchUrls} />
        </div>

        {/* URLs List */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Your URLs</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {urls.length} URL{urls.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-10">
              <Spinner color="#2563eb" />
            </div>
          ) : urls.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No URLs yet. Shorten one above!</p>
            </div>
          ) : (
            <div className="max-h-[500px] overflow-y-auto">
              {/* Column Headers */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center mb-4 p-4 border-b border-gray-300 sticky top-0 bg-white z-10">
                <div className="lg:col-span-3">
                  <p className="text-sm font-bold text-gray-800">Short URL</p>
                </div>
                <div className="lg:col-span-3">
                  <p className="text-sm font-bold text-gray-800">Original URL</p>
                </div>
                <div className="lg:col-span-1">
                  <p className="text-sm font-bold text-gray-800 text-center">QR Code</p>
                </div>
                <div className="lg:col-span-1">
                  <p className="text-sm font-bold text-gray-800 text-center">Clicks</p>
                </div>
                <div className="lg:col-span-1">
                  <p className="text-sm font-bold text-gray-800 text-center">Status</p>
                </div>
                <div className="lg:col-span-2">
                  <p className="text-sm font-bold text-gray-800 text-center">Created Date</p>
                </div>
                <div className="lg:col-span-1">
                  <p className="text-sm font-bold text-gray-800 text-center">Actions</p>
                </div>
              </div>

              {/* URLs List with Scroll */}
              <div className="space-y-4">
                {urls.map((url) => {
                  const shortUrl = `${process.env.REACT_APP_API_URL}/${url.shortId}`;
                  return (
                    <div key={url.shortId} className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                        
                        {/* Short URL - 3 columns */}
                        <div className="lg:col-span-3">
                          <a
                            href={shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline text-sm break-all block truncate"
                            title={shortUrl}
                          >
                            {shortUrl}
                          </a>
                        </div>

                        {/* Original URL - 3 columns */}
                        <div className="lg:col-span-3">
                          <a
                            href={url.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-500 hover:underline text-sm break-all block truncate"
                            title={url.originalUrl}
                          >
                            {url.originalUrl}
                          </a>
                        </div>

                        {/* QR Code - 1 column */}
                        <div className="lg:col-span-1 flex justify-center">
                          <QRCodeCanvas
                            value={shortUrl}
                            size={40}
                            bgColor="#ffffff"
                            fgColor="#000000"
                            level="M"
                          />
                        </div>

                        {/* Clicks - 1 column */}
                        <div className="lg:col-span-1 text-center">
                          <p className="text-gray-800 font-bold text-sm">{url.clicks.length}</p>
                        </div>

                        {/* Status - 1 column */}
                        <div className="lg:col-span-1 text-center">
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                            url.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {url.active ? 'Active' : 'Inactive'}
                          </div>
                        </div>

                        {/* Date Created - 2 columns */}
                        <div className="lg:col-span-2 text-center">
                          <p className="text-gray-800 text-sm">
                            {new Date(url.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Action Button - 1 column */}
                        <div className="lg:col-span-1 text-center">
                          <button
                            onClick={() => handleMoreInfo(url.shortId)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg shadow transition duration-200 text-sm"
                          >
                            Details
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
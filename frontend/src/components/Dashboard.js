import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import UrlShortener from './UrlShortener';
import Spinner from 'react-spinners/PulseLoader';
import { AuthContext } from '../context/AuthContext';
import { QRCodeCanvas } from 'qrcode.react';
import { LogOut, Link2, BarChart3, Copy, ExternalLink, Calendar, MousePointerClick } from 'lucide-react';

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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy');
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
              <Link2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Dashboard</h1>
              <p className="text-gray-600 text-sm">Manage your shortened URLs</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* URL Shortener */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 mb-8 border border-gray-200">
          <UrlShortener onShorten={fetchUrls} />
        </div>

        {/* URLs List */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your URLs</h2>
            <span className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full font-medium">
              {urls.length} URL{urls.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="text-center">
                <Spinner color="#2563eb" size={12} />
                <p className="text-gray-600 mt-4">Loading your URLs...</p>
              </div>
            </div>
          ) : urls.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Link2 className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg">No URLs yet</p>
              <p className="text-gray-500 text-sm mt-2">Create your first shortened URL above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {urls.map((url) => {
                const shortUrl = `${window.location.origin}/s/${url.shortId}`;
                return (
                  <div key={url.shortId} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-200 group">
                    <div className="flex flex-col lg:flex-row gap-4">
                      
                      {/* Left: URL Info */}
                      <div className="flex-1 space-y-3">
                        {/* Short URL */}
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Link2 className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-medium mb-1">Short URL</p>
                            <div className="flex items-center gap-2">
                              <a
                                href={shortUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 font-medium truncate flex items-center gap-1"
                                title={shortUrl}
                              >
                                {shortUrl}
                                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                              </a>
                              <button
                                onClick={() => copyToClipboard(shortUrl)}
                                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                                title="Copy URL"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Original URL */}
                        <div className="flex items-center gap-2">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <ExternalLink className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-medium mb-1">Original URL</p>
                            <a
                              href={url.originalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-700 text-sm truncate block"
                              title={url.originalUrl}
                            >
                              {url.originalUrl}
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Center: Stats */}
                      <div className="flex lg:flex-col gap-4 justify-around lg:justify-center lg:items-center lg:border-l lg:border-r lg:px-6">
                        {/* Clicks */}
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                            <MousePointerClick className="w-4 h-4" />
                          </div>
                          <p className="text-2xl font-bold text-gray-800">{url.clicks.length}</p>
                          <p className="text-xs text-gray-500">Clicks</p>
                        </div>

                        {/* Status */}
                        <div className="text-center">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            url.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {url.active ? '✓ Active' : '⏸ Paused'}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Status</p>
                        </div>

                        {/* Date */}
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <p className="text-sm font-medium text-gray-800">
                            {new Date(url.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-xs text-gray-500">Created</p>
                        </div>
                      </div>

                      {/* Right: QR Code & Actions */}
                      <div className="flex lg:flex-col items-center gap-4">
                        {/* QR Code */}
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-2">
                          <QRCodeCanvas
                            value={shortUrl}
                            size={60}
                            bgColor="#ffffff"
                            fgColor="#000000"
                            level="M"
                          />
                        </div>

                        {/* Details Button */}
                        <button
                          onClick={() => handleMoreInfo(url.shortId)}
                          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap"
                        >
                          <BarChart3 className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

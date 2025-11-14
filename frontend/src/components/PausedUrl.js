import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PauseCircle, Home, Link2 } from 'lucide-react';

const PausedUrl = () => {
  const navigate = useNavigate();
  const { shortId } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 md:p-12 border border-gray-200 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-2xl shadow-lg">
            <PauseCircle className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
          URL Paused
        </h1>

        {/* Message */}
        <p className="text-gray-700 mb-2 text-lg font-medium">
          This shortened URL is currently inactive
        </p>
        {shortId && (
          <p className="text-gray-500 text-sm mb-6">
            Short ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{shortId}</span>
          </p>
        )}
        <p className="text-gray-600 mb-8">
          The owner has temporarily paused this link. Please contact them to reactivate it.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Home className="w-5 h-5" />
            <span>Go to Dashboard</span>
          </button>
          
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200"
          >
            <Link2 className="w-5 h-5" />
            <span>Create Your Own Short URL</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PausedUrl;
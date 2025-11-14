import React from 'react';
import { useNavigate } from 'react-router-dom';

const PausedUrl = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-6">
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">URL Paused</h1>
        <p className="text-gray-600 mb-6">
          This URL is currently paused or has expired. Please contact the owner to reactivate it.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PausedUrl;
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Spinner from 'react-spinners/PulseLoader';
import ReCAPTCHA from 'react-google-recaptcha';

const ReCAPTCHAModal = ({ isOpen, onClose, onVerify, onConfirm }) => {
  const [recaptchaCompleted, setRecaptchaCompleted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Verify You're Not a Robot</h3>
        <ReCAPTCHA
          sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
          onChange={(token) => {
            onVerify(token);
            setRecaptchaCompleted(!!token);
          }}
        />
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!recaptchaCompleted}
            className={`py-2 px-4 rounded-lg transition duration-200 ${
              recaptchaCompleted
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const UrlShortener = ({ onShorten }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async () => {
    if (!originalUrl) {
      toast.error('Please enter a URL');
      return;
    }

    const isVerified = sessionStorage.getItem('recaptchaVerified');
    if (!isVerified && !recaptchaToken) {
      setIsModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/shorten`, {
        originalUrl,
        recaptchaToken: recaptchaToken || 'session-verified',
      });
      toast.success(`URL shortened successfully! Short URL: ${res.data.shortUrl}`, {
        duration: 5000,
      });
      setOriginalUrl('');
      setRecaptchaToken(null);
      sessionStorage.setItem('recaptchaVerified', 'true');
      setIsModalOpen(false);
      onShorten();
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Session expired, please log in again');
        window.location.href = '/login';
      } else if (err.response?.data?.error === 'reCAPTCHA verification failed') {
        toast.error('reCAPTCHA verification failed, please try again');
        setRecaptchaToken(null);
        sessionStorage.removeItem('recaptchaVerified');
        setIsModalOpen(true);
      } else {
        toast.error(err.response?.data?.error || 'Failed to shorten URL');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = (token) => {
    setRecaptchaToken(token);
  };

  const handleConfirm = async () => {
    if (!recaptchaToken) {
      toast.error('Please complete reCAPTCHA verification');
      return;
    }
    await handleSubmit();
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Shorten Your URLs
        </h2>
        <p className="text-gray-600 text-lg">Fast, secure, and easy URL shortening with analytics</p>
      </div>
      
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col sm:flex-row items-center w-full max-w-3xl gap-3"
      >
        <input
          type="url"
          placeholder="🔗 Paste your long URL here..."
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className="w-full sm:flex-1 px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
          required
        />
        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          disabled={loading}
        >
          {loading ? (
            <Spinner size={10} color="white" />
          ) : (
            <>
              <span className="text-lg">✨ Shorten Now</span>
            </>
          )}
        </button>
      </form>
      
      <ReCAPTCHAModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setRecaptchaToken(null);
        }}
        onVerify={handleVerify}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default UrlShortener;
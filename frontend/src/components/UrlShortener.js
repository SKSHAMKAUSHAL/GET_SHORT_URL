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
    <div className="flex flex-col items-center justify-center space-y-4">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 text-center">
        RandomShortly
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col items-center w-full max-w-md space-y-4"
      >
        <input
          type="url"
          placeholder="Enter your link here"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow transition duration-200 flex justify-center items-center"
          disabled={loading}
        >
          {loading ? <Spinner size={10} color="white" /> : 'Shorten Now'}
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
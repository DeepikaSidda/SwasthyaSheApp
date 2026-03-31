import React, { useState } from 'react';

const NewsletterSubscribe = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || '';
      const response = await fetch(`${apiEndpoint}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Thank you for subscribing!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="bg-purple-50 p-4 sm:p-6 rounded-lg shadow-sm mx-auto max-w-md w-full my-4 sm:my-6">
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Subscribe to Our Newsletter</h3>
      <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
        Stay updated with the latest health tips and wellness practices.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-200"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
        {message && (
          <p className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </form>

      {/* Footer with your name */}
      <div className="mt-6 pt-4 border-t border-purple-100">
        <p className="text-center text-sm text-gray-500">
          Created with ❤️ by{' '}
          <span className="font-medium text-purple-600">Sidda deepika</span>
        </p>
      </div>
    </div>
  );
};

export default NewsletterSubscribe;

import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/forgot-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      await response.json();
      setSent(true);
      toast.success('If your email is registered, a reset link has been sent.');
    } catch {
      toast.error('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
        {sent ? (
          <p className="text-green-600">Check your email for a reset link.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="block mb-2">Email Address</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded mb-4"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
};

export default ForgotPassword;
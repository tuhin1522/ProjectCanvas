import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const VerificationPending = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
    const pendingEmail = localStorage.getItem('pendingVerification');
    if (!pendingEmail) {
        navigate('/login');
    }
    setEmail(pendingEmail);
    }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-sky-50 pt-20 pb-12 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
          <p className="mt-4 text-gray-600">
            We've sent a verification email to:
          </p>
          <p className="mt-1 text-lg font-medium text-indigo-600">{email}</p>
          <p className="mt-4 text-gray-600">
            Please check your inbox and click on the verification link to complete your registration.
            The link will expire after 2 minutes.
          </p>
          
          <div className="mt-8 space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
              <p className="text-sm text-yellow-700">
                Didn't receive an email? Check your spam folder or try the options below.
              </p>
            </div>
            
            <Link 
              to="/resend-verification"
              className="block w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors text-center"
            >
              Resend Verification Email
            </Link>
            
            <Link 
              to="/signup"
              className="block w-full px-6 py-3 border border-indigo-300 text-indigo-700 font-medium rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors text-center"
            >
              Try with Different Email
            </Link>
            
            <div className="text-center">
              <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPending;
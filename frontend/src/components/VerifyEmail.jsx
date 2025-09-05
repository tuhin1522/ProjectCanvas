import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [verifying, setVerifying] = useState(true);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(null);
    const requestSent = useRef(false);

    useEffect(() => {
        const verifyEmail = async () => {
        // Prevent multiple requests
        if (requestSent.current) return;
        requestSent.current = true;
        
        try {
            const response = await fetch(`http://localhost:8000/api/verify-email/${token}/`);
            const data = await response.json();
            
            if (response.ok) {
            setVerified(true);
            // Clear the pending verification email
            localStorage.removeItem('pendingVerification');
            toast.success('Email verified successfully!');
            // Redirect to login page after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
            } else {
            setError(data.error || 'Verification failed');
            toast.error(data.error || 'Verification failed');
            }
        } catch (error) {
            console.error("Verification error:", error);
            setError('Network error. Please try again later.');
            toast.error('Network error. Please try again later.');
        } finally {
            setVerifying(false);
        }
        };

        verifyEmail();
    }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-sky-50 pt-20 pb-12 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        {verifying ? (
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h2 className="text-2xl font-bold text-gray-900">Verifying your email...</h2>
            <p className="mt-2 text-gray-600">Please wait while we verify your email address.</p>
          </div>
        ) : verified ? (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Email Verified!</h2>
            <p className="mt-2 text-gray-600">Your email has been successfully verified.</p>
            <p className="mt-1 text-gray-600">You'll be redirected to login page shortly.</p>
            <div className="mt-6">
              <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Click here if you're not redirected automatically
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <div className="mt-6">
              <p className="text-gray-600">
                Need a new verification link?{' '}
                <Link to="/resend-verification" className="text-indigo-600 hover:text-indigo-800 font-medium">
                  Click here
                </Link>
              </p>
              <p className="mt-4 text-gray-600">
                Or go back to{' '}
                <Link to="/signup" className="text-indigo-600 hover:text-indigo-800 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default VerifyEmail;
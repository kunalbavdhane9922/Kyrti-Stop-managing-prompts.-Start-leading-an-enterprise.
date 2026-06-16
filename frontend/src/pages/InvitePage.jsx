import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { companyApi } from '../services/companyApi';

export default function InvitePage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [invite, setInvite] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    async function fetchInvite() {
      try {
        const { data } = await companyApi.getInvitation(token);
        setInvite(data);
      } catch (err) {
        setError(err.message || 'Invalid or expired invitation');
      } finally {
        setLoading(false);
      }
    }
    fetchInvite();
  }, [token]);

  const handleAccept = async () => {
    setAccepting(true);
    setError('');
    try {
      await companyApi.acceptInvitation(token);
      navigate('/dashboard'); // Go to dashboard after accepting
    } catch (err) {
      if (err.message && err.message.includes('email does not match')) {
        setError('Your current logged-in email does not match the invitation email. Please logout and login with the correct account.');
      } else if (err.message && err.message.toLowerCase().includes('unauthorized')) {
        // Not logged in
        navigate(`/login?redirect=/invite/${token}`);
      } else {
        setError(err.message || 'Failed to accept invitation');
      }
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6 text-white relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-[1.01]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
              Workspace Invitation
            </h1>
            <p className="text-gray-400">Join your team to start collaborating</p>
          </div>

          {error ? (
            <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 text-sm text-center">
              {error}
              {error.includes('expired') || error.includes('Invalid') ? (
                <div className="mt-4">
                  <button onClick={() => navigate('/login')} className="text-indigo-400 hover:text-indigo-300 underline">
                    Go to Login
                  </button>
                </div>
              ) : null}
            </div>
          ) : invite ? (
            <div className="space-y-6">
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50 text-center">
                <p className="text-sm text-gray-400 mb-1">You have been invited to join</p>
                <p className="text-xl font-semibold text-white mb-4">Workspace {invite.tenantId}</p>
                <p className="text-xs text-gray-500">Invited email: <span className="text-gray-300">{invite.email}</span></p>
              </div>

              <button
                onClick={handleAccept}
                disabled={accepting}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-900/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {accepting ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {accepting ? 'Accepting...' : 'Accept Invitation'}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

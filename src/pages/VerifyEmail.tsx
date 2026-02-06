import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/useAuthStore';
import { supabase } from '@/config/supabase';

export default function VerifyEmail() {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const { verifyEmail } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get('email') || '';

  useEffect(() => {
    // Check if user is coming from Supabase email confirmation
    const checkSession = async () => {
      try {
        console.log('🔍 Checking for Supabase session after email confirmation...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Session check error:', error);
          setIsVerifying(false);
          return;
        }
        
        if (session?.user) {
          // User confirmed email via Supabase - THIS IS THE PROPER WAY
          console.log('✅ Email confirmed via Supabase:', session.user.email);
          console.log('📧 Email confirmed at:', session.user.email_confirmed_at);
          console.log('👤 User ID:', session.user.id);
          
          // Create local account for the verified user using Supabase user ID
          const userId = session.user.id; // Use Supabase user ID
          const userEmail = session.user.email || '';
          
          const newUser = {
            id: userId,
            email: userEmail,
            password: 'supabase-authenticated', // Will use Supabase for login
            name: session.user.user_metadata?.name || userEmail.split('@')[0],
            emailVerified: true,
            createdAt: new Date().toISOString(),
          };

          const storedUsers = JSON.parse(localStorage.getItem('tradepro-users') || '{}');
          
          // Check if user already exists
          if (!storedUsers[userEmail]) {
            storedUsers[userEmail] = newUser;
            localStorage.setItem('tradepro-users', JSON.stringify(storedUsers));
            console.log('✅ Local user account created');

            // Create initial portfolio
            const portfolios = JSON.parse(localStorage.getItem('tradepro-portfolios') || '{}');
            if (!portfolios[userId]) {
              portfolios[userId] = {
                balance: 100000,
                holdings: [],
                transactions: [],
              };
              localStorage.setItem('tradepro-portfolios', JSON.stringify(portfolios));
              console.log('✅ Initial portfolio created');
            }
          } else {
            console.log('ℹ️ User already exists in local storage');
          }

          // Remove from pending if exists
          const pendingUsers = JSON.parse(localStorage.getItem('tradepro-pending-users') || '{}');
          if (pendingUsers[userEmail]) {
            delete pendingUsers[userEmail];
            localStorage.setItem('tradepro-pending-users', JSON.stringify(pendingUsers));
            console.log('✅ Removed from pending users');
          }

          toast.success('Email verified successfully! You can now login.');
          setTimeout(() => navigate('/login'), 1500);
        } else {
          console.log('ℹ️ No active session found');
          setIsVerifying(false);
        }
      } catch (error) {
        console.error('❌ Session check error:', error);
        setIsVerifying(false);
      }
    };

    checkSession();
  }, [navigate]);

  const handleResendEmail = async () => {
    if (!email) {
      toast.error('Email not found. Please try signing up again.');
      return;
    }

    setIsLoading(true);

    try {
      // Get pending user data
      const pendingUsers = JSON.parse(localStorage.getItem('tradepro-pending-users') || '{}');
      const pendingUser = pendingUsers[email];

      if (!pendingUser) {
        toast.error('User not found. Please try signing up again.');
        return;
      }

      // Resend verification email via Supabase
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Verification email resent! Please check your email.');
    } catch (error: any) {
      console.error('Resend error:', error);
      toast.error(error.message || 'Failed to resend email');
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email...</h2>
          <p className="text-gray-600">Please wait while we confirm your email address.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Email</h2>
          <p className="text-gray-600">
            Check your email for the confirmation link<br />
            <span className="font-medium text-blue-600">{email}</span>
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Instructions:</strong><br />
              1. Check your email inbox<br />
              2. Click the confirmation link in the email<br />
              3. You'll be automatically redirected here<br />
              4. If you don't receive the email, check your spam folder
            </p>
          </div>

          <button
            onClick={handleResendEmail}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Sending...' : 'Resend Verification Email'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/signup')}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            ← Back to Signup
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup, verifyEmail } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Demo bypass signup
    if (email === 'demo@gmail.com') {
      toast.success('Account created successfully! (Demo Mode)');
      navigate('/dashboard');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match', {
        duration: 5000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '500',
        }
      });
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters', {
        duration: 5000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '500',
        }
      });
      return;
    }

    setIsLoading(true);

    try {
      await signup(email, password);
      toast.success('Verification email sent! Please check your email to create your account.', {
        duration: 10000, // 10 seconds
        style: {
          background: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '500',
        }
      });
      // Stay on signup page as requested
    } catch (error: any) {
      toast.error(error.message || 'Signup failed', {
        duration: 5000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '500',
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!email || !password) {
      toast.error('Please enter email and password first', {
        duration: 5000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '500',
        }
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim() || undefined;
      await verifyEmail(email, password, fullName);
      toast.success('Account created and verified! You can now login.', {
        duration: 8000, // 8 seconds
        style: {
          background: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '500',
        }
      });
    } catch (error: any) {
      toast.error(error.message || 'Verification failed', {
        duration: 5000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '500',
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const primaryButtonShadow = 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px';
  
  const secondaryButtonShadow = 'rgba(158, 158, 158, 0.69) 0px 0.706592px 0.706592px -0.583333px, rgba(158, 158, 158, 0.68) 0px 1.80656px 1.80656px -1.16667px, rgba(158, 158, 158, 0.65) 0px 3.62176px 3.62176px -1.75px, rgba(158, 158, 158, 0.61) 0px 6.8656px 6.8656px -2.33333px, rgba(158, 158, 158, 0.52) 0px 13.6468px 13.6468px -2.91667px, rgba(158, 158, 158, 0.3) 0px 30px 30px -3.5px, rgb(255, 255, 255) 0px 3px 1px 0px inset';

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Create your account</h1>
          <p className="text-gray-600">Start building your ideas today</p>
        </div>

        <div className="bg-gray-50 rounded-3xl p-10 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-base font-semibold text-gray-700">
                  First name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="h-14 bg-white border-gray-200 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:ring-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-base font-semibold text-gray-700">
                  Last name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="h-14 bg-white border-gray-200 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:ring-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold text-gray-700">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 bg-white border-gray-200 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:ring-0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-base font-semibold text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-14 bg-white border-gray-200 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:ring-0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-base font-semibold text-gray-700">
                Confirm password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-14 bg-white border-gray-200 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:ring-0"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              style={{ boxShadow: primaryButtonShadow }}
              className="w-full h-14 bg-black text-white hover:bg-black/95 font-medium text-base rounded-xl mt-6"
            >
              {isLoading ? 'Creating account...' : 'Continue'}
            </Button>

            {/* Verify Email Button */}
            <Button
              type="button"
              onClick={handleVerifyEmail}
              disabled={isLoading}
              variant="outline"
              className="w-full h-12 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 font-medium text-sm rounded-xl mt-3"
            >
              {isLoading ? 'Verifying...' : 'Verify Email (for testing)'}
            </Button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-50 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                style={{ boxShadow: secondaryButtonShadow }}
                className="h-14 bg-white border-0 hover:bg-gray-50 font-normal text-base rounded-xl"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>

              <Button
                type="button"
                variant="outline"
                style={{ boxShadow: secondaryButtonShadow }}
                className="h-14 bg-white border-0 hover:bg-gray-50 font-normal text-base rounded-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-gray-900 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

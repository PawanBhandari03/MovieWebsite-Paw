import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, User, Lock, ArrowRight, CheckCircle, KeyRound } from 'lucide-react';

type AuthStep = 'LOGIN' | 'REGISTER_EMAIL' | 'REGISTER_DETAILS' | 'VERIFY' | 'FORGOT_PASSWORD';

const Auth = () => {
    const navigate = useNavigate();
    const { login, register, resendVerificationEmail, googleSignIn, resetPassword } = useAuth();
    const [step, setStep] = useState<AuthStep>('LOGIN');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            // We use email for login in Firebase
            await login({ name: 'User', username: '', email: username.includes('@') ? username : '', emailVerified: false }, password);
            navigate('/profile');
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/invalid-credential') {
                setError('Invalid email or password');
            } else {
                setError('Failed to login. Please check your credentials.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterEmail = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.includes('@')) {
            setStep('REGISTER_DETAILS');
            setError('');
        } else {
            setError('Please enter a valid email');
        }
    };

    const handleRegisterDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name && username && password) {
            setIsLoading(true);
            setError('');
            try {
                await register({ name, username, email, emailVerified: false }, password);
                setStep('VERIFY');
            } catch (err: any) {
                console.error(err);
                if (err.code === 'auth/email-already-in-use') {
                    setError('Email is already in use');
                } else if (err.code === 'auth/weak-password') {
                    setError('Password should be at least 6 characters');
                } else {
                    setError('Failed to create account. Please try again.');
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleResendEmail = async () => {
        setIsLoading(true);
        try {
            await resendVerificationEmail();
            alert('Verification email sent!');
        } catch (err) {
            console.error(err);
            setError('Failed to send verification email');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn();
            navigate('/profile');
        } catch (error) {
            console.log(error);
            setError('Failed to sign in with Google');
        }
    }

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.includes('@')) {
            setError('Please enter a valid email');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            await resetPassword(email);
            setStep('LOGIN');
            alert('Password reset link sent to your email');
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/user-not-found') {
                setError('No account found with this email');
            } else {
                setError('Failed to send reset link');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center px-4 pt-20">
            <div className="w-full max-w-md">
                <motion.div
                    layout
                    className="bg-secondary/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {step === 'LOGIN' && 'Welcome Back'}
                            {step === 'REGISTER_EMAIL' && 'Create Account'}
                            {step === 'REGISTER_DETAILS' && 'Complete Profile'}
                            {step === 'VERIFY' && 'Check Your Email'}
                            {step === 'FORGOT_PASSWORD' && 'Reset Password'}
                        </h1>
                        <p className="text-gray-400">
                            {step === 'LOGIN' && 'Enter your credentials to access your account'}
                            {step === 'REGISTER_EMAIL' && 'Enter your email to get started'}
                            {step === 'REGISTER_DETAILS' && 'Tell us a bit about yourself'}
                            {step === 'VERIFY' && `We sent a verification link to ${email}`}
                            {step === 'FORGOT_PASSWORD' && 'Enter your email to receive a reset link'}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 'LOGIN' && (
                            <motion.form
                                key="login"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleLogin}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Email</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full bg-black/20 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-accent outline-none transition-colors"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-black/20 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-accent outline-none transition-colors"
                                            placeholder="Enter password"
                                        />
                                    </div>
                                    {error && <p className="text-red-500 text-sm">{error}</p>}
                                </div>
                                <div className="flex justify-end">
                                    <button type="button" onClick={() => setStep('FORGOT_PASSWORD')} className="text-sm text-gray-400 hover:text-white transition-colors">
                                        Forgot password?
                                    </button>
                                </div>
                                <button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/80 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50">
                                    {isLoading ? 'Signing In...' : 'Sign In'}
                                </button>
                                <p className="text-center text-gray-400 text-sm">
                                    <button type="button" onClick={() => setStep('REGISTER_EMAIL')} className="text-accent hover:underline">
                                        Sign up
                                    </button>
                                </p>
                                <div className="relative my-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-700"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="bg-[#1a1a1a] px-2 text-gray-400">Or continue with</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    className="w-full bg-white text-black hover:bg-gray-100 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Google
                                </button>
                            </motion.form>
                        )}

                        {step === 'REGISTER_EMAIL' && (
                            <motion.form
                                key="register-email"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleRegisterEmail}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-black/20 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-accent outline-none transition-colors"
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                    {error && <p className="text-red-500 text-sm">{error}</p>}
                                </div>
                                <button type="submit" className="w-full bg-accent hover:bg-accent/80 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                                    Continue <ArrowRight className="w-4 h-4" />
                                </button>
                                <p className="text-center text-gray-400 text-sm">
                                    Already have an account?{' '}
                                    <button type="button" onClick={() => setStep('LOGIN')} className="text-accent hover:underline">
                                        Sign in
                                    </button>
                                </p>
                                <div className="relative my-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-700"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="bg-[#1a1a1a] px-2 text-gray-400">Or continue with</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    className="w-full bg-white text-black hover:bg-gray-100 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Google
                                </button>
                            </motion.form>
                        )}

                        {step === 'REGISTER_DETAILS' && (
                            <motion.form
                                key="register-details"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleRegisterDetails}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-black/20 border border-gray-700 rounded-lg py-3 px-4 text-white focus:border-accent outline-none transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Username</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-black/20 border border-gray-700 rounded-lg py-3 px-4 text-white focus:border-accent outline-none transition-colors"
                                        placeholder="johndoe123"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-black/20 border border-gray-700 rounded-lg py-3 px-4 text-white focus:border-accent outline-none transition-colors"
                                        placeholder="Create a password"
                                    />
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-accent hover:bg-accent/80 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Processing...' : 'Create Account'}
                                </button>
                                <button type="button" onClick={() => setStep('REGISTER_EMAIL')} className="w-full text-gray-400 hover:text-white text-sm">
                                    Back
                                </button>
                            </motion.form>
                        )}

                        {step === 'FORGOT_PASSWORD' && (
                            <motion.form
                                key="forgot-password"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleForgotPassword}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-black/20 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-accent outline-none transition-colors"
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                    {error && <p className="text-red-500 text-sm">{error}</p>}
                                </div>
                                <button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/80 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                                    <KeyRound className="w-4 h-4" />
                                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                                <button type="button" onClick={() => setStep('LOGIN')} className="w-full text-gray-400 hover:text-white text-sm">
                                    Back to Login
                                </button>
                            </motion.form>
                        )}

                        {step === 'VERIFY' && (
                            <motion.div
                                key="verify"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6 text-center"
                            >
                                <div className="flex justify-center">
                                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-8 h-8 text-green-500" />
                                    </div>
                                </div>
                                <p className="text-gray-300">
                                    Please check your email inbox and click the verification link we just sent you. Once verified, you can log in.
                                </p>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setStep('LOGIN')}
                                        className="w-full bg-accent hover:bg-accent/80 text-white font-semibold py-3 rounded-lg transition-colors"
                                    >
                                        Go to Login
                                    </button>
                                    <button
                                        onClick={handleResendEmail}
                                        disabled={isLoading}
                                        className="text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        {isLoading ? 'Sending...' : 'Resend Verification Email'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default Auth;

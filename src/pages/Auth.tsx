import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, User, Lock, ArrowRight, CheckCircle } from 'lucide-react';

type AuthStep = 'LOGIN' | 'REGISTER_EMAIL' | 'REGISTER_DETAILS' | 'VERIFY';

const Auth = () => {
    const navigate = useNavigate();
    const { login, register, resendVerificationEmail } = useAuth();
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
                        </h1>
                        <p className="text-gray-400">
                            {step === 'LOGIN' && 'Enter your credentials to access your account'}
                            {step === 'REGISTER_EMAIL' && 'Enter your email to get started'}
                            {step === 'REGISTER_DETAILS' && 'Tell us a bit about yourself'}
                            {step === 'VERIFY' && `We sent a verification link to ${email}`}
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
                                <button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/80 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50">
                                    {isLoading ? 'Signing In...' : 'Sign In'}
                                </button>
                                <p className="text-center text-gray-400 text-sm">
                                    Don't have an account?{' '}
                                    <button type="button" onClick={() => setStep('REGISTER_EMAIL')} className="text-accent hover:underline">
                                        Sign up
                                    </button>
                                </p>
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

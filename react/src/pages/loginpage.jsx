import React, { useState } from 'react';
import Footer from "../components/footer";
import { authAPI } from '../services/api';
import { FiEye, FiEyeOff } from 'react-icons/fi';

function LoginPage({ onNavigate, setCurrentUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const user = await authAPI.login(email, password);
            // Store user data in localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));
            setCurrentUser(user);
            onNavigate('dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md flex-grow flex flex-col justify-center">
                {/* App Title */}
                <h1 className="text-5xl font-bold mb-8" style={{ color: '#1F41BB' }}>
                    ToDo
                </h1>

                {/* Login Card */}
                <div className="bg-white rounded-3xl shadow-lg p-10">
                    {/* Header */}
                    <h2 className="text-3xl font-bold text-center mb-4" style={{ color: '#1F41BB' }}>
                        Login here
                    </h2>
                    <p className="text-center text-gray-700 font-semibold mb-12 leading-relaxed">
                        Welcome back you've
                        <br />
                        been missed!
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form Fields */}
                    <div className="px-4">
                        <div className="mb-12">
                            <input
                                type="email"
                                placeholder="sample@mail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                className="w-full px-6 py-4 mb-6 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base block disabled:opacity-50"
                            />

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                                    disabled={loading}
                                    className="w-full px-6 py-4 pr-12 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base block disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Buttons */}
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full py-4 text-white text-base font-semibold rounded-xl mb-6 hover:opacity-90 transition-opacity shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: '#1F41BB' }}
                        >
                            {loading ? 'Logging in...' : 'Log in'}
                        </button>

                        <button
                            onClick={() => onNavigate('signup')}
                            disabled={loading}
                            className="w-full text-gray-700 text-base font-semibold hover:text-blue-600 transition-colors py-2 disabled:opacity-50"
                        >
                            Create new account
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer at bottom */}
            <Footer />
        </div>
    );
}

export default LoginPage;
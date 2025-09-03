'use client';

import { useState } from 'react';

interface LoginFormProps {
    onLogin: () => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (username === 'tuongvan1901' && password === 'anhyeuemnhieu') {
            onLogin();
        } else {
            setError('Tên đăng nhập hoặc mật khẩu không đúng!');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-love-100 to-pink-love-200 p-4">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md animate-float">
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-pink-love-600 mb-2 font-cute">WebsiteNinhVoYeu 💕</h1>
                    <p className="text-pink-love-500 text-sm sm:text-base">Đăng nhập để bắt đầu</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                            Tên đăng nhập
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-pink-love-300 rounded-lg focus:ring-2 focus:ring-pink-love-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                            placeholder="Nhập tên đăng nhập"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-pink-love-300 rounded-lg focus:ring-2 focus:ring-pink-love-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                            placeholder="Nhập mật khẩu"
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-love-500 to-pink-love-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:from-pink-love-600 hover:to-pink-love-700 transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
                    >
                        Đăng nhập 💖
                    </button>
                </form>
            </div>
        </div>
    );
}

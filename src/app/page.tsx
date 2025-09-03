'use client';

import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import MiniGame from '../components/MiniGame';
import RewardVideo from '../components/RewardVideo';

type GameState = 'login' | 'game' | 'reward' | 'complete';

export default function Home() {
    const [gameState, setGameState] = useState<GameState>('login');

    const handleLogin = () => {
        setGameState('game');
    };

    const handleGameComplete = () => {
        setGameState('reward');
    };

    const handleRewardComplete = () => {
        setGameState('complete');
    };

    const resetGame = () => {
        setGameState('login');
    };

    return (
        <div className="min-h-screen">
            {gameState === 'login' && <LoginForm onLogin={handleLogin} />}

            {gameState === 'game' && <MiniGame onGameComplete={handleGameComplete} />}

            {gameState === 'reward' && <RewardVideo onComplete={handleRewardComplete} />}

            {gameState === 'complete' && (
                <div className="min-h-screen bg-gradient-to-br from-pink-love-100 to-pink-love-200 flex items-center justify-center p-1 sm:p-4">
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-8 max-w-sm sm:max-w-md w-full text-center animate-float">
                        <div className="text-3xl sm:text-6xl mb-3 sm:mb-4 animate-bounce-slow">🎊</div>
                        <h1 className="text-lg sm:text-3xl font-bold text-pink-love-600 mb-3 sm:mb-4 font-cute">
                            Hoàn thành! 💕
                        </h1>
                        <p className="text-gray-700 mb-4 sm:mb-6 text-xs sm:text-base">
                            Cảm ơn em na yêu đã chơi! Hy vọng em na yêu hết giận anh yêu. 💖
                        </p>
                        <button
                            onClick={resetGame}
                            className="bg-gradient-to-r from-pink-love-500 to-pink-love-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:from-pink-love-600 hover:to-pink-love-700 transition-all duration-200 transform hover:scale-105 text-xs sm:text-base"
                        >
                            Chơi lại 🎮
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

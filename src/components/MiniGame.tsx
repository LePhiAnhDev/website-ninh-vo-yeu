'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

interface MiniGameProps {
    onGameComplete: () => void;
}

interface Position {
    x: number;
    y: number;
}

export default function MiniGame({ onGameComplete }: MiniGameProps) {
    const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 });
    const [heartPos, setHeartPos] = useState<Position>({ x: 0, y: 0 });
    const [score, setScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [showStartPopup, setShowStartPopup] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const getCenterPosition = (): Position => {
        if (!gameAreaRef.current) return { x: 0, y: 0 };

        const rect = gameAreaRef.current.getBoundingClientRect();
        return {
            x: (rect.width - 32) / 2, // 32px là kích thước vật thể
            y: (rect.height - 32) / 2
        };
    };

    const generateRandomPosition = (): Position => {
        if (!gameAreaRef.current) return { x: 200, y: 150 };

        const rect = gameAreaRef.current.getBoundingClientRect();
        const maxX = rect.width - 20; // 20px là kích thước trái tim
        const maxY = rect.height - 20;

        return {
            x: Math.random() * maxX,
            y: Math.random() * maxY
        };
    };

    const checkCollision = (pos1: Position, pos2: Position, threshold: number = 30): boolean => {
        const distance = Math.sqrt(
            Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
        );
        return distance < threshold;
    };

    const playTingSound = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(console.error);
        }
    };

    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        if (!gameStarted) return;

        const moveDistance = 20;
        setPlayerPos(prev => {
            let newX = prev.x;
            let newY = prev.y;

            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    newY = Math.max(0, prev.y - moveDistance);
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    newY = Math.min(600, prev.y + moveDistance);
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    newX = Math.max(0, prev.x - moveDistance);
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    newX = Math.min(750, prev.x + moveDistance);
                    break;
            }

            return { x: newX, y: newY };
        });
    }, [gameStarted]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    // Căn giữa vật thể khi component mount và khi game area thay đổi kích thước
    useEffect(() => {
        const centerPlayer = () => {
            // Sử dụng setTimeout để đảm bảo game area đã được render
            setTimeout(() => {
                const centerPos = getCenterPosition();
                setPlayerPos(centerPos);
                setHeartPos(generateRandomPosition());
            }, 100);
        };

        // Căn giữa ngay lập tức
        centerPlayer();

        // Căn giữa lại khi window resize
        const handleResize = () => {
            centerPlayer();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (gameStarted && checkCollision(playerPos, heartPos)) {
            setScore(prev => prev + 1);
            setHeartPos(generateRandomPosition());
            playTingSound(); // Phát âm thanh ting khi ăn tim

            if (score + 1 >= 10) {
                setShowLoading(true);
                // Hiển thị loading 3 giây trước khi chuyển sang phần thưởng
                setTimeout(() => {
                    onGameComplete();
                }, 3000);
            }
        }
    }, [playerPos, heartPos, score, gameStarted, onGameComplete]);

    const startGame = () => {
        setShowStartPopup(false);
        setGameStarted(true);
        // Căn giữa vật thể khi bắt đầu game
        setTimeout(() => {
            const centerPos = getCenterPosition();
            setPlayerPos(centerPos);
        }, 100);
    };

    // Touch/Mouse event handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        if (!gameStarted) return;
        e.preventDefault();
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!gameStarted || !isDragging) return;
        e.preventDefault();
        const touch = e.touches[0];
        const rect = gameAreaRef.current?.getBoundingClientRect();
        if (rect) {
            const newX = Math.max(0, Math.min(rect.width - 32, touch.clientX - rect.left));
            const newY = Math.max(0, Math.min(rect.height - 32, touch.clientY - rect.top));
            setPlayerPos({ x: newX, y: newY });
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!gameStarted) return;
        e.preventDefault();
        setIsDragging(false);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!gameStarted) return;
        e.preventDefault();
        setIsDragging(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!gameStarted || !isDragging) return;
        e.preventDefault();
        const rect = gameAreaRef.current?.getBoundingClientRect();
        if (rect) {
            const newX = Math.max(0, Math.min(rect.width - 32, e.clientX - rect.left));
            const newY = Math.max(0, Math.min(rect.height - 32, e.clientY - rect.top));
            setPlayerPos({ x: newX, y: newY });
        }
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!gameStarted) return;
        e.preventDefault();
        setIsDragging(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-love-100 to-pink-love-200 flex flex-col items-center justify-center p-1 sm:p-4">
            {/* Audio element for ting sound */}
            <audio ref={audioRef} preload="auto">
                <source src="/ting-sound.mp3" type="audio/mpeg" />
            </audio>

            <div className="text-center mb-2 sm:mb-6">
                <h1 className="text-lg sm:text-4xl font-bold text-pink-love-600 mb-1 sm:mb-2 font-cute animate-bounce-slow">WebsiteNinhVoYeu 💕</h1>
                <div className="text-sm sm:text-2xl font-semibold text-pink-love-500">
                    Score: {score}/10 ❤️
                </div>
            </div>

            <div
                ref={gameAreaRef}
                className="relative bg-white rounded-xl sm:rounded-2xl shadow-xl border-2 sm:border-4 border-pink-love-300 w-full max-w-sm sm:max-w-4xl h-48 sm:h-96 overflow-hidden touch-none select-none"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {/* Player object */}
                <div
                    className="absolute transition-all duration-100 ease-out"
                    style={{
                        left: `${playerPos.x}px`,
                        top: `${playerPos.y}px`,
                        width: '32px',
                        height: '32px'
                    }}
                >
                    <Image
                        src="/obj.png"
                        alt="Player"
                        width={32}
                        height={32}
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Heart */}
                <div
                    className="absolute transition-all duration-300 ease-out"
                    style={{
                        left: `${heartPos.x}px`,
                        top: `${heartPos.y}px`,
                        width: '20px',
                        height: '20px'
                    }}
                >
                    <div className="text-red-500 text-lg sm:text-3xl animate-pulse-heart">❤️</div>
                </div>
            </div>

            <div className="mt-2 sm:mt-6 text-center px-2 sm:px-4">
                <p className="text-pink-love-600 font-medium mb-1 sm:mb-2 text-xs sm:text-base">
                    <span className="hidden sm:inline">Sử dụng phím mũi tên hoặc WASD để di chuyển</span>
                    <span className="sm:hidden">Chạm và kéo để di chuyển</span>
                </p>
                <p className="text-pink-love-500 text-xs sm:text-sm">
                    Thu thập 10 trái tim để nhận phần thưởng! 💖
                </p>
            </div>

            {/* Start Game Popup */}
            {showStartPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white p-4 sm:p-8 rounded-xl sm:rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full text-center">
                        <div className="text-3xl sm:text-6xl mb-3 sm:mb-4">🎮</div>
                        <h2 className="text-lg sm:text-2xl font-bold text-pink-love-600 mb-3 sm:mb-4 font-cute">
                            Chào mừng đến với Mini Game! 🎮
                        </h2>
                        <p className="text-gray-700 mb-4 sm:mb-6 text-xs sm:text-lg">
                            Hãy ăn 10 trái tim để nhận phần thưởng 💕
                        </p>
                        <button
                            onClick={startGame}
                            className="bg-gradient-to-r from-pink-love-500 to-pink-love-600 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:from-pink-love-600 hover:to-pink-love-700 transition-all duration-200 transform hover:scale-105 text-xs sm:text-base"
                        >
                            Bắt đầu chơi 🎯
                        </button>
                    </div>
                </div>
            )}

            {/* Loading Screen */}
            {showLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white p-4 sm:p-8 rounded-xl sm:rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full text-center animate-float">
                        <div className="text-4xl sm:text-6xl mb-3 sm:mb-4 animate-bounce-slow">🎉</div>
                        <h2 className="text-lg sm:text-3xl font-bold text-pink-love-600 mb-3 sm:mb-4 font-cute">
                            Chúc mừng! 🎊
                        </h2>
                        <p className="text-gray-700 mb-4 sm:mb-6 text-xs sm:text-lg">
                            Bạn đã thu thập đủ 10 trái tim! 💕
                        </p>
                        <div className="flex items-center justify-center mb-3 sm:mb-4">
                            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-pink-love-500"></div>
                        </div>
                        <p className="text-pink-love-500 text-xs sm:text-sm">
                            Đang chuẩn bị phần thưởng...
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

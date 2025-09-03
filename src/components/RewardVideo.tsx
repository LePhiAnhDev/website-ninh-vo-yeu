'use client';

import { useState, useRef } from 'react';

interface RewardVideoProps {
    onComplete: () => void;
}

export default function RewardVideo({ onComplete }: RewardVideoProps) {
    const [currentVideo, setCurrentVideo] = useState(1);
    const [showContinueButton, setShowContinueButton] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleVideoEnd = () => {
        if (currentVideo === 1) {
            setShowContinueButton(true);
        } else {
            onComplete();
        }
    };

    const handleContinue = () => {
        setCurrentVideo(2);
        setShowContinueButton(false);
        // Force video to reload with new source
        if (videoRef.current) {
            videoRef.current.load();
            videoRef.current.play();
        }
    };

    const getVideoSrc = () => {
        return currentVideo === 1 ? '/video-001.MOV' : '/video-002.MOV';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-love-100 to-pink-love-200 flex items-center justify-center p-1 sm:p-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-8 max-w-sm sm:max-w-4xl w-full animate-float">
                <div className="text-center mb-3 sm:mb-6">
                    <h1 className="text-lg sm:text-4xl font-bold text-pink-love-600 mb-1 sm:mb-2 font-cute animate-bounce-slow">🎉 Phần thưởng của bạn! 🎉</h1>
                    <p className="text-pink-love-500 text-xs sm:text-lg">
                        Chúc mừng! Em na yêu đã thu thập đủ 10 trái tim! 💕
                    </p>
                </div>

                <div className="relative bg-black rounded-lg sm:rounded-xl overflow-hidden shadow-lg">
                    <video
                        key={currentVideo}
                        ref={videoRef}
                        className="w-full h-auto max-h-64 sm:max-h-96 object-contain"
                        controls
                        autoPlay
                        onEnded={handleVideoEnd}
                        onError={(e) => {
                            console.error('Video error:', e);
                            // Fallback nếu video không load được
                            if (currentVideo === 1) {
                                setShowContinueButton(true);
                            } else {
                                onComplete();
                            }
                        }}
                    >
                        <source src={getVideoSrc()} type="video/mp4" />
                        <source src={getVideoSrc()} type="video/quicktime" />
                        Trình duyệt của bạn không hỗ trợ video.
                    </video>
                </div>

                {showContinueButton && currentVideo === 1 && (
                    <div className="text-center mt-3 sm:mt-6">
                        <button
                            onClick={handleContinue}
                            className="bg-gradient-to-r from-pink-love-500 to-pink-love-600 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:from-pink-love-600 hover:to-pink-love-700 transition-all duration-200 transform hover:scale-105 text-xs sm:text-base"
                        >
                            Tiếp tục 💖
                        </button>
                    </div>
                )}

                <div className="text-center mt-3 sm:mt-6">
                    <p className="text-pink-love-600 font-medium text-xs sm:text-base">
                        Video {currentVideo}/2 🎬
                    </p>
                </div>
            </div>
        </div>
    );
}


import React from 'react';
import { motion } from 'framer-motion';
import { TextScramble } from './TextScramble';

interface BigLogoSectionProps {
    logoText?: string;
    subtitle?: string;
    className?: string;
}

const BigLogoSection: React.FC<BigLogoSectionProps> = ({
    logoText = "TRADEPRO",
    subtitle = "ELITE TRADING PLATFORM",
    className = ""
}) => {
    return (
        <section className={`bg-black py-10 px-4 overflow-hidden relative ${className}`}>
            <div className="container mx-auto">
                <div className="text-center relative">
                    {/* Main Logo Text with Text Scramble */}
                    <div
                        className="font-black leading-none relative z-10"
                        style={{
                            fontSize: 'clamp(3rem, 12vw, 10rem)',
                            letterSpacing: '-0.02em',
                            color: '#FFFFFF' // Explicitly set to White
                        }}
                    >
                        <TextScramble
                            text={logoText}
                            className="justify-center text-white"
                        />
                    </div>

                    {/* Animated Gradient Overlay - Made subtler and white-ish to respect "White Color" request */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.0) 100%)',
                            mixBlendMode: 'overlay',
                        }}
                        animate={{
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="text-gray-400 text-xl md:text-2xl mt-6 font-medium tracking-wider"
                    >
                        {subtitle}
                    </motion.p>

                    {/* Decorative Elements */}
                    <div className="absolute inset-0 pointer-events-none">
                        {/* Glowing Orbs - Kept purple/blue but dramatically reduced opacity to keep focus on White Text */}
                        <motion.div
                            className="absolute top-1/2 left-1/4 w-32 h-32 bg-purple-600 rounded-full opacity-10 blur-3xl"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.1, 0.2, 0.1],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <motion.div
                            className="absolute top-1/3 right-1/4 w-24 h-24 bg-blue-500 rounded-full opacity-10 blur-3xl"
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.1, 0.2, 0.1],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1
                            }}
                        />

                        {/* Floating Particles */}
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-white rounded-full opacity-30"
                                style={{
                                    left: `${20 + Math.random() * 60}%`,
                                    top: `${20 + Math.random() * 60}%`,
                                }}
                                animate={{
                                    y: [-20, 20, -20],
                                    opacity: [0.3, 0.8, 0.3],
                                    scale: [1, 1.5, 1],
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 2,
                                    repeat: Infinity,
                                    delay: Math.random() * 2,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Background Grid Pattern */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
                    backgroundSize: '50px 50px'
                }}
            />
        </section>
    );
};

export default BigLogoSection;

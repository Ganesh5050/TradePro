
import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface TextScrambleProps {
    text: string;
    className?: string;
    duration?: number;
    characterSet?: string;
    trigger?: boolean;
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+~`|}{[]:;?><,./-=';

export const TextScramble: React.FC<TextScrambleProps> = ({
    text,
    className = '',
    duration = 1.5,
    characterSet = DEFAULT_CHARS,
    trigger = true,
}) => {
    const [displayText, setDisplayText] = useState(text);
    const [isScrambling, setIsScrambling] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: false, amount: 0.5 });
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const frameRef = useRef<number | null>(null);

    const startScramble = () => {
        if (isScrambling) return;
        setIsScrambling(true);

        let frame = 0;
        const totalFrames = duration * 60; // 60fps assumption

        const update = () => {
            // Calculate progress 0 to 1
            const progress = frame / totalFrames;

            let scrambled = '';
            const revealIndex = Math.floor(progress * text.length);

            for (let i = 0; i < text.length; i++) {
                if (i < revealIndex) {
                    // Revealed characters
                    scrambled += text[i];
                } else {
                    // Random characters
                    const randomChar = characterSet[Math.floor(Math.random() * characterSet.length)];
                    // Optionally keep spaces as spaces to maintain layout
                    if (text[i] === ' ') {
                        scrambled += ' ';
                    } else {
                        scrambled += randomChar;
                    }
                }
            }

            setDisplayText(scrambled);
            frame++;

            if (frame <= totalFrames) {
                frameRef.current = requestAnimationFrame(update);
            } else {
                setDisplayText(text);
                setIsScrambling(false);
            }
        };

        if (frameRef.current) cancelAnimationFrame(frameRef.current);
        frameRef.current = requestAnimationFrame(update);
    };

    useEffect(() => {
        // Trigger on mount/view
        if (trigger && isInView) {
            startScramble();
        }
    }, [trigger, isInView]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, []);

    const handleMouseEnter = () => {
        // Reset and start again
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
        setIsScrambling(false);
        // Use a small timeout to allow state reset if needed, but direct call works too usually
        // We want to force a restart even if it was finished.
        // However, if we are currently scrambling, maybe let it finish or restart? 
        // "Just restart" is usually the expected "hacker" feel.
        startScramble();
    };

    return (
        <motion.div
            ref={containerRef}
            className={`inline-block font-mono cursor-default ${className}`}
            onMouseEnter={handleMouseEnter}
            aria-label={text}
        >
            {displayText}
        </motion.div>
    );
};

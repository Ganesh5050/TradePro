
import React from 'react';
import { motion } from 'framer-motion';

interface MaskedTextRevealProps {
    text?: string;
    className?: string;
    direction?: 'up' | 'down';
    staggerDelay?: number;
    manualTrigger?: boolean;
}

export const MaskedTextReveal: React.FC<MaskedTextRevealProps> = ({
    text = "",
    className = "",
    direction = "up",
    staggerDelay = 0.05,
    manualTrigger = false,
}) => {
    const words = text.split(" ");

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: staggerDelay, delayChildren: 0.04 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: direction === "up" ? 20 : -20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };

    const Wrapper = manualTrigger ? motion.div : motion.div;

    return (
        <Wrapper
            className={`overflow-hidden flex flex-wrap ${className}`}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
        >
            {words.map((word, index) => (
                <motion.span
                    variants={child}
                    style={{ marginRight: "0.25em" }}
                    key={index}
                >
                    {word}
                </motion.span>
            ))}
        </Wrapper>
    );
};

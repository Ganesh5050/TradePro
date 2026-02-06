
import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealFooterProps {
    children: React.ReactNode;
    footer: React.ReactNode;
}

export const ScrollRevealFooter: React.FC<ScrollRevealFooterProps> = ({ children, footer }) => {
    const [footerHeight, setFooterHeight] = useState(0);
    const footerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateHeight = () => {
            if (footerRef.current) {
                setFooterHeight(footerRef.current.offsetHeight);
            }
        };

        updateHeight();
        const resizeObserver = new ResizeObserver(updateHeight);
        if (footerRef.current) {
            resizeObserver.observe(footerRef.current);
        }
        window.addEventListener('resize', updateHeight);

        // Navbar behavior logic
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const viewportBottom = scrollTop + windowHeight;

            // The "content" ends effectively at (documentHeight - footerHeight).
            // The reveal "starts" exactly when the viewport bottom hits that line.
            // We add a tiny buffer (e.g. 10px) so it feels responsive immediately upon entering.
            const revealStartPoint = documentHeight - footerHeight;

            if (viewportBottom > revealStartPoint + 20) {
                document.body.classList.add('hide-navbar');
            } else {
                document.body.classList.remove('hide-navbar');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateHeight);
            window.removeEventListener('scroll', handleScroll);
            document.body.classList.remove('hide-navbar');
        };
    }, [footerHeight]);

    return (
        <div className="relative min-h-screen w-full bg-black">
            <div
                className="relative z-10 bg-white w-full rounded-b-[3rem] shadow-2xl"
                style={{
                    marginBottom: `${footerHeight}px`
                }}
            >
                {children}
            </div>

            <div
                ref={footerRef}
                className="fixed bottom-0 left-0 w-full z-0"
                style={{
                    visibility: footerHeight ? 'visible' : 'hidden'
                }}
            >
                {footer}
            </div>
        </div>
    );
};

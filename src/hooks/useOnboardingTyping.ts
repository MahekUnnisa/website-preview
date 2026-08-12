import { useEffect, useRef, useState } from 'react';

/** Smooth character-by-character typing for onboarding headlines */
export function useOnboardingTyping(text: string, onComplete?: () => void, skip = false): string {
    const [displayed, setDisplayed] = useState(skip ? text : '');
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    useEffect(() => {
        if (skip) {
            setDisplayed(text);
            onCompleteRef.current?.();
            return undefined;
        }

        let index = 0;
        let frameId = 0;
        let lastTimestamp = 0;
        let completed = false;
        const baseDelay = 14;
        const jitter = 10;
        const stride = 2;

        setDisplayed('');

        const step = (timestamp: number) => {
            if (index >= text.length) {
                if (!completed) {
                    completed = true;
                    onCompleteRef.current?.();
                }
                return;
            }

            if (!lastTimestamp) {
                lastTimestamp = timestamp;
            }

            const threshold = baseDelay + Math.random() * jitter;
            if (timestamp - lastTimestamp >= threshold) {
                index = Math.min(text.length, index + stride);
                setDisplayed(text.slice(0, index));
                lastTimestamp = timestamp;
            }

            frameId = window.requestAnimationFrame(step);
        };

        frameId = window.requestAnimationFrame(step);

        return () => {
            if (frameId) {
                window.cancelAnimationFrame(frameId);
            }
        };
    }, [skip, text]);

    return displayed;
}

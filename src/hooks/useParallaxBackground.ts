import { MutableRefObject, useCallback, useEffect } from 'react';

export const useParallaxBackground = (
    ref: MutableRefObject<HTMLDivElement | null>
) => {
    const handleScroll = useCallback((e: Event) => {
        const target = e.target as EventTarget;
        if (!(target instanceof Document) || !ref.current) {
            return;
        }

        const ratio = window.scrollY / target.documentElement.scrollHeight;
        ref.current.style.top = `-${ratio * 200}px`;
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
};

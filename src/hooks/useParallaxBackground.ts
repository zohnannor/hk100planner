import { RefObject, useCallback, useEffect } from 'react';

const useParallaxBackground = (ref: RefObject<HTMLDivElement | null>) => {
    const handleScroll = useCallback((e: Event) => {
        const target = e.target;
        if (!(target instanceof Document) || !ref.current) {
            return;
        }

        const ratio = window.scrollY / target.documentElement.scrollHeight;
        ref.current.style.top = `-${ratio * 200}px`;
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useParallaxBackground;

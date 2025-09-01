import { useCallback, useEffect, useState } from 'react';

const useBreakpoint = (breakpoint: number) => {
    const [isMatch, setIsMatch] = useState(false);
    const handleResize = useCallback(() => {
        setIsMatch(window.innerWidth < breakpoint);
    }, [setIsMatch, breakpoint]);

    useEffect(() => {
        setIsMatch(window.innerWidth < breakpoint);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return isMatch;
};

export default useBreakpoint;

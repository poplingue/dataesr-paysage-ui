import { useEffect, useState } from 'react';

const mediumBreakpoint = 767;
const largeBreakpoint = 992;

const useViewport = () => {
    const [size, setSize] = useState({ mobile: null, tablet: null, desktop: null });

    useEffect(() => {
        const handleWindowResize = () => {
            setSize({
                mobile: window ? innerWidth <= mediumBreakpoint : null,
                tablet: window
                    ? innerWidth <= largeBreakpoint && innerWidth > mediumBreakpoint
                    : null,
                desktop: window ? innerWidth > largeBreakpoint : null,
            });
        };

        handleWindowResize();
        window.addEventListener('resize', handleWindowResize);

        return () => window.removeEventListener('resize', handleWindowResize);
    }, []);

    return size;
};

export default useViewport;

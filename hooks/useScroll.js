import { useEffect, useState } from 'react';

const useScroll = (element, options) => {
    const [scrollY, setScrollY] = useState(0);
    const [scrollingDown, setScrollingDown] = useState(false);
    const [scrollTop, setScrollTop] = useState(0);
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        const onScroll = (e) => {
            const scrollTopDocument = e.target.documentElement.scrollTop;
            setScrollTop(scrollTopDocument);
            setScrollingDown(scrollTopDocument > scrollTop);
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', onScroll);

        return () => window.removeEventListener('scroll', onScroll);
    }, [scrollY, scrollingDown, scrollTop]);

    useEffect(() => {
        const cb = (entry) => setIsIntersecting(() => entry.isIntersecting);
        const callback = (entries) => entries.forEach(cb);
        const observer = new IntersectionObserver(callback, options);

        if (element) {
            observer.observe(element);
        }

        return () => element && observer.unobserve(element);
    }, [element, options]);

    return { scrollY, scrollTop, scrollingDown, isIntersecting };
};

export default useScroll;

import { useEffect, useState } from 'react';

const useCSSProperty = (property) => {
    const [style, setStyle] = useState(null);

    useEffect(() => {
        const handleStyle = () => {
            setStyle(getComputedStyle(document.documentElement).getPropertyValue(property))
        };

        handleStyle();

    }, [property]);

    return { style };
};

export default useCSSProperty;

import Link from 'next/link';
import { forwardRef } from 'react';

const Component = ({ onClick, href, text }, ref) => {
    return (
        <Link href={href} passHref>
            <a href={href} onClick={onClick} ref={ref}>
                {text}
            </a>
        </Link>
    );
};

const LinkClick = forwardRef(Component);

export default LinkClick;

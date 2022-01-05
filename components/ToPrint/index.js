import { forwardRef } from 'react';

const Component = ({ children }, ref) => {
    return <div ref={ref}>{children}</div>;
};

const ToPrint = forwardRef(Component);

export default ToPrint;

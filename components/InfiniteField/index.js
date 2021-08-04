import AddFieldButton from '../AddButton';
import { Col } from '@dataesr/react-dsfr';
import { useState, cloneElement, Children } from 'react';

function InfiniteField({ children, title }) {
    const [number, setNumber] = useState(1);
    const plusOne = () => {
        setNumber(number + 1);
    };
    return (<Col n="12">
            {Array.apply(null, { length: number }).map((v, i) => {
                    return <div key={title}>
                        {Children.toArray(children).map(
                            (child) => cloneElement(child, { keyNumber:i }),
                        )}
                    </div>;
                }
            )}
            <Col>
                <AddFieldButton onClick={plusOne} title={title}/>
            </Col>
        </Col>
    );

}

export default InfiniteField;

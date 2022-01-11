import grid from '../../helpers/imports';
import useAccordions from '../../hooks/useAccordions';
import useCSSProperty from '../../hooks/useCSSProperty';
import AccordionObject from '../AccordionObject';
import PageTheme from '../PageTheme';
import ToPrint from '../ToPrint';
import Identifier from './Identifier';
import Price from './Price';
import Responsability from './Responsability';
import Synthesis from './Synthesis/index';
import Web from './Web';

const components = {
    synthesis: Synthesis,
    responsability: Responsability,
    identifier: Identifier,
    web: Web,
    price: Price,
};

export default function Person({ fame, children, skeleton }) {
    const { Col, Row } = grid();

    const { style: pink } = useCSSProperty('--pink-tuile-main-556');
    const { expanded } = useAccordions(true);

    return (
        <PageTheme color={pink}>
            <Row gutters>
                {children}
                <Col>
                    <ToPrint>
                        <AccordionObject
                            components={components}
                            initExpand={expanded}
                            color={pink}
                            skeleton={skeleton}
                        />
                    </ToPrint>
                </Col>
            </Row>
        </PageTheme>
    );
}

Person.getServerSideProps = () => {
    return {
        props: {
            name: 'Sœur Emmanuelle',
        },
    };
};

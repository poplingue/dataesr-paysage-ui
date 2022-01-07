import { Col, Row } from '@dataesr/react-dsfr';
import useAccordions from '../../hooks/useAccordions';
import useCSSProperty from '../../hooks/useCSSProperty';
import AccordionObject from '../AccordionObject';
import PageTheme from '../PageTheme';
import ToPrint from '../ToPrint';
import Governance from './Governance';
import Presentation from './Presentation';

const components = {
    presentation: Presentation,
    governance: Governance,
};

export default function Structure({ children, skeleton }) {
    const { style: yellow } = useCSSProperty(
        '--green-tilleul-verveine-main-707'
    );
    const { expanded } = useAccordions(true);

    return (
        <PageTheme color={yellow}>
            <Row gutters>
                {children}
                <Col>
                    <ToPrint>
                        <AccordionObject
                            components={components}
                            initExpand={expanded}
                            color={yellow}
                            skeleton={skeleton}
                        />
                    </ToPrint>
                </Col>
            </Row>
        </PageTheme>
    );
}

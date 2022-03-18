import { useRouter } from 'next/router';
import { getObjectTypeDetails } from '../../config/utils';
import grid from '../../helpers/imports';
import useCSSProperty from '../../hooks/useCSSProperty';
import PageTheme from '../PageTheme';

export default function LegalCategory({ children, skeleton }) {
    const { Col, Row } = grid();
    const {
        query: { type },
    } = useRouter();

    const { style: color } = useCSSProperty(
        getObjectTypeDetails('', type).color
    );

    return (
        <PageTheme color={color}>
            <Row gutters>
                {children}
                <Col>Page catégorie légale</Col>
            </Row>
        </PageTheme>
    );
}

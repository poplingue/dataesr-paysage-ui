import { useRouter } from 'next/router';
import { getObjectTypeDetails } from '../../config/utils';
import grid from '../../helpers/imports';
import useCSSProperty from '../../hooks/useCSSProperty';
import PageTheme from '../PageTheme';

export default function Category({ children, skeleton }) {
    const { Col, Row } = grid();
    const {
        query: { type },
    } = useRouter();

    const { color } = getObjectTypeDetails('', type);
    const { style: green } = useCSSProperty(color);

    return (
        <PageTheme color={green}>
            <Row gutters>
                {children}
                <Col>Page Catégorie</Col>
            </Row>
        </PageTheme>
    );
}

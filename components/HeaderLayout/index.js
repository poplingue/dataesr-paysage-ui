import {
    Col,
    Container,
    Highlight,
    Row,
    Tag,
    Title,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { AppContext } from '../../context/GlobalState';
import DynamicBreadcrumb from '../DynamicBreadcrumb';

function HeaderLayout({ highlight, pageTitle, status, type, id }) {
    const {
        statePage: { hasBreadCrumbs },
    } = useContext(AppContext);

    return (
        <Container fluid spacing="mb-10w">
            <section>
                <Row>
                    <Col className="p-relative">
                        <DynamicBreadcrumb />
                        {pageTitle && (
                            <Container className="psg-content-wrapper">
                                <Row>
                                    <Col
                                        n="11"
                                        spacing={
                                            hasBreadCrumbs || highlight
                                                ? ''
                                                : 'mt-5w'
                                        }
                                        className="psg-header-page"
                                    >
                                        {highlight && (
                                            <Highlight
                                                size="sm"
                                                className="fr-mb-5w fr-mt-2w"
                                            >
                                                {highlight}
                                            </Highlight>
                                        )}
                                        <Row gutters>
                                            <Col n="12 md-6">
                                                <Title as="h2" look="h3">
                                                    {pageTitle}
                                                </Title>
                                            </Col>
                                        </Row>
                                        <Row gutters>
                                            <Col>
                                                {type && <Tag>{type}</Tag>}
                                                {status && (
                                                    <Tag>
                                                        {status === 'draft'
                                                            ? 'brouillon'
                                                            : 'publié'}
                                                    </Tag>
                                                )}
                                                {id && <Tag>{id}</Tag>}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Container>
                        )}
                    </Col>
                </Row>
            </section>
        </Container>
    );
}

HeaderLayout.default = {
    status: 'draft',
    pageTitle: '',
    highlight: '',
};

HeaderLayout.propTypes = {
    highlight: PropTypes.string,
    pageTitle: PropTypes.string,
    status: PropTypes.oneOf(['draft', 'published']),
};
export default HeaderLayout;

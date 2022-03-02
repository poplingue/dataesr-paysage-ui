import {
    Col,
    Container,
    Highlight,
    Row,
    Tag,
    Title,
} from '@dataesr/react-dsfr';
import { useContext } from 'react';
import { AppContext } from '../../context/GlobalState';
import DynamicBreadcrumb from '../DynamicBreadcrumb';

// TODO add proptypes
export default function HeaderLayout({ highlight, pageTitle, status }) {
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
                                            {status && (
                                                <Col n="12">
                                                    <Tag>
                                                        {status === 'draft'
                                                            ? 'Structure en draft'
                                                            : 'Structure publiée'}
                                                    </Tag>
                                                </Col>
                                            )}
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

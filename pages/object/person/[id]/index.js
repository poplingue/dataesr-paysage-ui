import { Col, Container, Icon, Row } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import FieldButton from '../../../../components/FieldButton';
import HeaderLayout from '../../../../components/HeaderLayout';
import Layout from '../../../../components/Layout';
import NavLink from '../../../../components/NavLink';
import Person from '../../../../components/Person';
import SideNavigation from '../../../../components/SideNavigation';
import ToolBox from '../../../../components/ToolBox';
import { AppContext } from '../../../../context/GlobalState';
import { PersonPageSkeleton } from '../../../../helpers/constants';
import useCSSProperty from '../../../../hooks/useCSSProperty';

export default function Object(props) {
    const {
        statePage: { printPage },
    } = useContext(AppContext);

    const router = useRouter();
    const { id } = router.query;
    const { style: pink } = useCSSProperty('--pink-tuile-main-556');

    return (
        <Layout>
            <HeaderLayout
                pageTitle="Une Personne"
                highlight="Last update on Tuesday 5th of September 2020"
            />
            <SideNavigation items={PersonPageSkeleton}>
                <Person id={id} fame={props.fame} name={props.name}>
                    <ToolBox>
                        <Container>
                            <Row gutters spacing="pb-2w">
                                <Col n="12">
                                    <ReactToPrint content={() => printPage}>
                                        <PrintContextConsumer>
                                            {({ handlePrint }) => (
                                                <FieldButton
                                                    title="Exporter en pdf"
                                                    onClick={() => {
                                                        if (printPage) {
                                                            handlePrint();
                                                        }
                                                    }}
                                                />
                                            )}
                                        </PrintContextConsumer>
                                    </ReactToPrint>
                                </Col>
                                <Col>
                                    <Icon name="ri-edit-line" color={pink}>
                                        <NavLink
                                            className="fs-14-24"
                                            href={`/update/person/${id}`}
                                        >
                                            Modifier
                                        </NavLink>
                                    </Icon>
                                </Col>
                            </Row>
                        </Container>
                    </ToolBox>
                </Person>
            </SideNavigation>
        </Layout>
    );
}

export async function getServerSideProps() {
    // fetch data Person by id
    return {
        props: {
            id: 0,
            name: 'Personne 0',
            fame: true,
        },
    };
}

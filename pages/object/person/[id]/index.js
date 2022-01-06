import {
    Col,
    Container,
    Icon,
    Modal,
    ModalContent,
    ModalFooter,
    ModalTitle,
    Row,
} from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useCallback, useContext, useState } from 'react';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import FieldButton from '../../../../components/FieldButton';
import HeaderLayout from '../../../../components/HeaderLayout';
import Layout from '../../../../components/Layout';
import NavLink from '../../../../components/NavLink';
import Person from '../../../../components/Person';
import PrintList from '../../../../components/PrintList';
import SideNavigation from '../../../../components/SideNavigation';
import ToolBox from '../../../../components/ToolBox';
import { AppContext } from '../../../../context/GlobalState';
import { PersonPageSkeleton } from '../../../../helpers/constants';
import { cleanedPrintPage, idToPrint } from '../../../../helpers/utils';
import useCSSProperty from '../../../../hooks/useCSSProperty';

export default function Object(props) {
    const {
        statePage: { printPage },
        dispatchPage: dispatch,
    } = useContext(AppContext);

    const router = useRouter();
    const { id } = router.query;
    const { style: pink } = useCSSProperty('--pink-tuile-main-556');
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [skeleton, setSetSkeleton] = useState(PersonPageSkeleton);

    const printThisOut = async (cb) => {
        validPrint().then((response) => {
            if (response && cb) {
                cb();
            }
        });
    };

    const validPrint = useCallback(() => {
        return new Promise((resolve) => {
            const printPage = cleanedPrintPage(idToPrint);

            dispatch({
                type: 'UPDATE_PRINT_PAGE',
                payload: {
                    printPage,
                },
            });

            resolve(printPage);
        });
    }, [dispatch]);

    const updatePrintPage = (sectionName) => {
        const newPrintPage = skeleton.map((section) => {
            const { title, content, component, print } = section;

            if (section.title === sectionName) {
                return { content, title, component, print: !print };
            }

            return section;
        });

        setSetSkeleton(newPrintPage);
    };

    const reset = () => {
        setIsOpenModal(false);
        setSetSkeleton(PersonPageSkeleton);
    };

    return (
        <Layout>
            <HeaderLayout
                pageTitle="Une Personne"
                highlight="Last update on Tuesday 5th of September 2020"
            />
            <Modal isOpen={isOpenModal} hide={reset}>
                <ModalTitle>Exporter en pdf</ModalTitle>
                <ModalContent>
                    <Container>
                        <Row>
                            <Col>
                                <PrintList
                                    legend="Choississez les sections à exporter"
                                    skeleton={skeleton}
                                    updatePrintPage={updatePrintPage}
                                />
                            </Col>
                        </Row>
                    </Container>
                </ModalContent>
                <ModalFooter>
                    <ReactToPrint
                        documentTitle="une_personne_au_22_01_2022"
                        onAfterPrint={reset}
                        content={() => printPage}
                    >
                        <PrintContextConsumer>
                            {({ handlePrint }) => (
                                <FieldButton
                                    title="Valider"
                                    onClick={() => printThisOut(handlePrint)}
                                />
                            )}
                        </PrintContextConsumer>
                    </ReactToPrint>
                </ModalFooter>
            </Modal>
            <SideNavigation items={skeleton}>
                <Person
                    id={id}
                    fame={props.fame}
                    name={props.name}
                    skeleton={skeleton}
                >
                    <ToolBox>
                        <Container>
                            <Row gutters spacing="pb-2w">
                                <Col n="12">
                                    <FieldButton
                                        title={`Exporter en pdf`}
                                        onClick={() => setIsOpenModal(true)}
                                    />
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

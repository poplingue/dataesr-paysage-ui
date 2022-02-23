import {
    Icon,
    Modal,
    ModalContent,
    ModalFooter,
    ModalTitle,
    Text,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useCallback, useContext, useState } from 'react';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import { cleanedPrintPage, idToPrint } from '../../helpers/utils';
import useAccordions from '../../hooks/useAccordions';
import FieldButton from '../FieldButton';
import PrintList from '../PrintList';
import styles from './ToolBox.module.scss';

export default function ToolBox({
    children,
    printer,
    accordions,
    initialSkeleton,
}) {
    const { Col, Row, Container } = grid();

    const [open, setOpen] = useState(false);
    const { Button } = useAccordions(true);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const { expandAll } = useAccordions(true);

    const {
        statePage: { printPage, accordionSkeleton },
        dispatchPage: dispatch,
    } = useContext(AppContext);

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
                payload: printPage,
            });

            resolve(printPage);
        });
    }, [dispatch]);

    const updateSkeleton = (skeleton) => {
        dispatch({
            type: 'UPDATE_ACCORDION_SKELETON',
            payload: skeleton,
        });
    };

    const updatePrintPage = (sectionName) => {
        const newPrintPage = accordionSkeleton.map((section) => {
            const { title, content, component, print } = section;

            if (section.title === sectionName) {
                return { content, title, component, print: !print };
            }

            return section;
        });
        updateSkeleton(newPrintPage);
    };

    const reset = () => {
        setIsOpenModal(false);

        if (initialSkeleton) {
            updateSkeleton(initialSkeleton);
        }
    };

    return (
        <div
            className={`${styles.ToolBox} ${open ? styles.Active : ''}`}
            data-cy="toolbox-header"
        >
            <div className={styles.Header} onClick={() => setOpen(!open)}>
                <Icon
                    name={`${open ? 'ri-arrow-right-s-line' : ''}`}
                    className={styles.Arrow}
                >
                    <Text
                        className={`${styles.HeaderTxt} ${
                            !open ? 'hidden' : ''
                        }`}
                    >
                        Outils
                    </Text>
                </Icon>
                <Icon
                    name="ri-tools-fill"
                    size="lg"
                    iconPosition="right"
                    className={`${styles.ToolIcon} ${
                        !open ? styles.Active : ''
                    }`}
                />
            </div>
            <div className={`${!open ? 'hidden' : ''}`}>
                <Container>
                    <Row gutters spacing="pb-2w">
                        {printer && (
                            <Col n="12">
                                <FieldButton
                                    title={`Exporter la fiche`}
                                    onClick={() => {
                                        expandAll();
                                        setIsOpenModal(true);
                                    }}
                                />
                            </Col>
                        )}
                        <Col>{children}</Col>
                        {accordions && <Col n="12">{Button}</Col>}
                    </Row>
                </Container>
            </div>
            <Modal isOpen={isOpenModal} hide={reset}>
                <ModalTitle>Exporter en pdf</ModalTitle>
                <ModalContent>
                    <Container>
                        <Row>
                            <Col>
                                <PrintList
                                    legend="Choississez les sections à exporter"
                                    skeleton={accordionSkeleton}
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
        </div>
    );
}

ToolBox.defaultProps = {
    printer: false,
    children: null,
};

ToolBox.propTypes = {
    printer: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.string,
    ]),
};

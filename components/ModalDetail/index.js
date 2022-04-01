import {
    Modal,
    ModalContent,
    ModalFooter,
    ModalTitle,
} from '@dataesr/react-dsfr';
import { useContext } from 'react';
import { AppContext } from '../../context/GlobalState';

export default function ModalDetail() {
    const {
        statePage: {
            modalDetail: { title, open, content, footer },
        },
        dispatchPage: dispatch,
    } = useContext(AppContext);

    return (
        <Modal
            isOpen={open}
            hide={() => {
                dispatch({
                    type: 'UPDATE_MODAL_DETAIL',
                    payload: { open: false },
                });
            }}
            title={title}
        >
            <ModalTitle>{title || 'No Title'}</ModalTitle>
            <ModalContent>{content || 'No content'}</ModalContent>
            {footer && <ModalFooter>{footer}</ModalFooter>}
        </Modal>
    );
}

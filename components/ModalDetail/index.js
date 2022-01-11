import { Modal, ModalContent, ModalTitle } from '@dataesr/react-dsfr';
import { useContext } from 'react';
import { AppContext } from '../../context/GlobalState';

export default function ModalDetail() {
    const {
        statePage: {
            modalDetail: { title, open, content },
        },
        dispatchPage: dispatch,
    } = useContext(AppContext);

    return (
        content &&
        title && (
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
                <ModalTitle>{title}</ModalTitle>
                <ModalContent>{content}</ModalContent>
            </Modal>
        )
    );
}

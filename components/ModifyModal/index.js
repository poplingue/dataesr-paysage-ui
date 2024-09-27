import {
    ButtonGroup,
    Button,
    Icon,
    Modal,
    ModalTitle,
    ModalContent,
    ModalClose,
    ModalFooter,
} from '@dataesr/react-dsfr';

import IdentifierForm from '../Form/identifierForm';

export default function ModifyModal({
    isOpen,
    subObject,
    subObjectData,
    hideFunctionHandler,
    onValueChangeHandler,
    onSaveHandler,
    onDeleteHandler,
}) {
    const modalTitle = { identifiers: "Modification d'un identifiant" };

    return (
        <Modal isOpen={isOpen} hide={hideFunctionHandler}>
            <ModalClose hide={hideFunctionHandler}>Fermer</ModalClose>
            <ModalTitle icon="ri-arrow-right-fill">
                {modalTitle[subObject]}
            </ModalTitle>
            <ModalContent>
                <IdentifierForm
                    identifierData={subObjectData}
                    onValueChangeHandler={onValueChangeHandler}
                    onSaveHandler={onSaveHandler}
                    onDeleteHandler={onDeleteHandler}
                />
            </ModalContent>
            <ModalFooter>
                <ButtonGroup
                    size="sm"
                    isEquisized
                    align="right"
                    isInlineFrom="md"
                >
                    <Button onClick={onDeleteHandler}>
                        <Icon name="ri-chat-delete-line" size="lg" />
                        Supprimer
                    </Button>
                    <Button onClick={onSaveHandler}>
                        <Icon name="ri-save-line" size="lg" />
                        Sauvegarder
                    </Button>
                </ButtonGroup>
            </ModalFooter>
        </Modal>
    );
}

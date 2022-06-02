import {
    ButtonGroup,
    Button,
    Icon,
    Container,
    Col,
    Row,
    TextInput,
} from '@dataesr/react-dsfr';
import { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../../context/GlobalState';
import { fetchHelper } from '../../../helpers/fetch';

import styles from './SocialmediaForm.module.scss';

export default function SocialmediaForm({ type, id, initialData }) {
    const [data, setData] = useState({});

    const {
        dispatchPage: dispatch,
        statePage: { socialmedias },
    } = useContext(AppContext);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const onValueChangeHandler = (key, e) => {
        const newData = { ...data };
        newData[key] = e.target.value;

        setData(newData);
    };

    const onSaveHandler = async () => {
        const url = `/api/${type}/${id}/socialmedias/${data.id}`;
        const body = {
            type: data.type,
            value: data.value,
        };
        const requestOptions = fetchHelper.requestOptions('PATCH', body);
        const response = await fetch(url, requestOptions);

        if (response.status === 200) {
            const newSocialmedias = [];
            socialmedias.forEach((socialmedia) => {
                if (socialmedia.id === data.id) {
                    socialmedia.type = data.type;
                    socialmedia.value = data.value;
                }

                newSocialmedias.push(socialmedia);
            });
            dispatch({
                type: 'UPDATE_SOCIALMEDIAS_OBJECT',
                payload: newSocialmedias,
            });
            dispatch({
                type: 'UPDATE_MODAL_DETAIL',
                payload: { open: false },
            });
        }
    };

    const onDeleteHandler = async () => {
        const url = `/api/${type}/${id}/socialmedias/${data.id}`;
        const requestOptions = fetchHelper.requestOptions('DELETE');
        const response = await fetch(url, requestOptions);

        if (response.status === 204) {
            const newSocialmedias = socialmedias.filter(
                (item) => item.id !== data.id
            );
            dispatch({
                type: 'UPDATE_SOCIALMEDIAS_OBJECT',
                payload: newSocialmedias,
            });
            dispatch({
                type: 'UPDATE_MODAL_DETAIL',
                payload: { open: false },
            });
        }
    };

    return (
        <Container>
            <Row>
                <Col>
                    <TextInput
                        label="Type"
                        value={data.type || ''}
                        onChange={(e) => onValueChangeHandler('type', e)}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <TextInput
                        label="Valeur"
                        value={data.value || ''}
                        onChange={(e) => onValueChangeHandler('value', e)}
                    />
                </Col>
            </Row>
            <hr />
            <a target="_blank" rel="norefferer noopener" href="#">
                Voir
            </a>
            <hr />
            <Row>
                <Col>
                    <ButtonGroup
                        size="sm"
                        isEquisized
                        align="right"
                        isInlineFrom="md"
                    >
                        <Button
                            onClick={onDeleteHandler}
                            className={styles.Danger}
                        >
                            <Icon name="ri-chat-delete-line" size="lg" />
                            Supprimer
                        </Button>
                        <Button onClick={onSaveHandler}>
                            <Icon name="ri-save-line" size="lg" />
                            Sauvegarder
                        </Button>
                    </ButtonGroup>
                </Col>
            </Row>
        </Container>
    );
}

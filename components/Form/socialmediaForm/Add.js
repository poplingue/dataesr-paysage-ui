import {
    Button,
    Icon,
    Container,
    Col,
    Row,
    TextInput,
} from '@dataesr/react-dsfr';
import { useState, useContext } from 'react';
import { AppContext } from '../../../context/GlobalState';
import { fetchHelper } from '../../../helpers/fetch';

export default function SocialmediaAddForm({ type, id }) {
    const [socialmediaType, setSocialmediaType] = useState(null);
    const [socialmediaValue, setSocialmediaValue] = useState(null);

    const {
        dispatchPage: dispatch,
        statePage: { socialmedias },
    } = useContext(AppContext);

    const onSaveHandler = async () => {
        const url = `/api/${type}/${id}/socialmedias`;
        const body = {
            type: socialmediaType,
            url: socialmediaValue,
        };

        const requestOptions = fetchHelper.requestOptions('POST', body);
        const response = await fetch(url, requestOptions);

        if (response.status === 201) {
            const newSocialmedias = [];
            newSocialmedias.push(body);
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

    return (
        <Container>
            <TextInput
                label="Type"
                value={socialmediaType}
                onChange={(e) => setSocialmediaType(e.target.value)}
            />
            <TextInput
                label="URL"
                value={socialmediaValue}
                onChange={(e) => setSocialmediaValue(e.target.value)}
            />
            <hr />
            <Row>
                <Col>
                    <Button onClick={onSaveHandler}>
                        <Icon name="ri-save-line" size="lg" />
                        Sauvegarder
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

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

// import styles from './WeblinkForm.module.scss';

export default function DocumentAddForm({ type, id }) {
    const [weblinkType, setWeblinkType] = useState(null);
    const [weblinkUrl, setWeblinkUrl] = useState(null);

    const {
        dispatchPage: dispatch,
        statePage: { weblinks },
    } = useContext(AppContext);

    const onSaveHandler = async () => {
        const url = `/api/${type}/${id}/weblinks`;
        const body = {
            type: weblinkType,
            url: weblinkUrl,
        };

        const requestOptions = fetchHelper.requestOptions('POST', body);
        const response = await fetch(url, requestOptions);

        if (response.status === 201) {
            const newWeblinks = [];
            newWeblinks.push(body);
            weblinks.forEach((weblink) => {
                if (weblink.id === data.id) {
                    weblink.type = data.type;
                    weblink.url = data.url;
                }

                newWeblinks.push(weblink);
            });
            dispatch({
                type: 'UPDATE_WEBLINKS_OBJECT',
                payload: newWeblinks,
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
                value={weblinkType}
                onChange={(e) => setWeblinkType(e.target.value)}
            />
            <TextInput
                label="URL"
                value={weblinkUrl}
                onChange={(e) => setWeblinkUrl(e.target.value)}
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

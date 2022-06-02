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


import styles from './WeblinkForm.module.scss';

export default function WeblinkForm({ type, id, initialData }) {
    const [data, setData] = useState({});

    const {
        dispatchPage: dispatch,
        statePage: { weblinks },
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
        const url = `/api/${type}/${id}/weblinks/${data.id}`;
        const body = {
            type: data.type,
            url: data.url,
        };
        const requestOptions = fetchHelper.requestOptions('PATCH', body);
        const response = await fetch(url, requestOptions);

        if (response.status === 200) {
            const newWeblinks = [];
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

    const onDeleteHandler = async () => {
        const url = `/api/${type}/${id}/weblinks/${data.id}`;
        const requestOptions = fetchHelper.requestOptions('DELETE');
        const response = await fetch(url, requestOptions);

        if (response.status === 204) {
            const newWeblinks = weblinks.filter((item) => item.id !== data.id);
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
                        label="Url"
                        value={data.url || ''}
                        onChange={(e) => onValueChangeHandler('url', e)}
                    />
                </Col>
            </Row>
            {/* <TextInputField
        label={data.type}
        valueLabel='url'
        value={data.url}
        onValueChangeHandler={onValueChangeHandler}
      /> */}
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

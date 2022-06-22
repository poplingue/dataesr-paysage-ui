import {
    ButtonGroup,
    Button,
    Icon,
    Container,
    Col,
    RadioGroup,
    Radio,
    Row,
} from '@dataesr/react-dsfr';
import { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../../context/GlobalState';
import { fetchHelper } from '../../../helpers/fetch';

import DateMultiFields from '../SubComponents/DateMultiFields/DateMultiFields';
import TextInputField from '../SubComponents/TextInputField/TextInputField';

import styles from './IdentifierForm.module.scss';

export default function IdentifierForm({ type, id, initialData }) {
    const [data, setData] = useState({});

    const {
        dispatchPage: dispatch,
        statePage: { identifiers },
    } = useContext(AppContext);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const onValueChangeHandler = (key, e) => {
        let value = e.target.value;
        if (value === 'true') value = true;
        if (value === 'false') value = false;
        const newData = { ...data };
        newData[key] = value;

        setData(newData);
    };

    const onDateChangeHandler = (key, value) => {
        const newData = { ...data };
        newData[key] = value;

        setData(newData);
    };

    const onSaveHandler = async () => {
        const url = `/api/${type}/${id}/identifiers/${data.id}`;
        const body = {
            type: data.type,
            value: data.value,
            active: data.active,
            startDate: data.startDate,
            endDate: data.endDate,
        };
        const requestOptions = fetchHelper.requestOptions('PATCH', body);
        const response = await fetch(url, requestOptions);

        if (response.status === 200) {
            const newIdentifiers = [];
            identifiers.forEach((identifier) => {
                if (identifier.id === data.id) {
                    identifier.type = data.type;
                    identifier.value = data.value;
                    identifier.active = data.active;
                    identifier.startDate = data.startDate;
                    identifier.endDate = data.endDate;
                }

                newIdentifiers.push(identifier);
            });
            dispatch({
                type: 'UPDATE_IDENTIFIERS_OBJECT',
                payload: newIdentifiers,
            });
            dispatch({
                type: 'UPDATE_MODAL_DETAIL',
                payload: { open: false },
            });
        }
    };

    const onDeleteHandler = async () => {
        console.log(data);
    };

    return (
        <Container>
            <Row>
                <Col>
                    <RadioGroup isInline>
                        <Radio
                            label="Actif"
                            value={true}
                            checked={data.active}
                            onChange={(e) => onValueChangeHandler('active', e)}
                        />
                        <Radio
                            label="Inactif"
                            value={false}
                            checked={!data.active}
                            onChange={(e) => onValueChangeHandler('active', e)}
                        />
                    </RadioGroup>
                </Col>
            </Row>

            <TextInputField
                label={data.type}
                valueLabel="value"
                value={data.value}
                onValueChangeHandler={onValueChangeHandler}
            />
            <hr />
            <DateMultiFields
                startDate={data.startDate}
                endDate={data.endDate}
                onValueChangeHandler={onDateChangeHandler}
            />
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

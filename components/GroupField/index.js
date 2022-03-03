import { Col, Container, Row } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { configValidators } from '../../config/objects';
import { AppContext } from '../../context/GlobalState';
import {
    getFieldValue,
    getFormName,
    getSubObjectType,
    getUniqueId,
} from '../../helpers/utils';
import DBService from '../../services/DB.service';
import SwitchField from '../SwitchField';

export default function GroupField({
    validatorId,
    content,
    title,
    section,
    updateValidSection,
    subObject,
    hint,
}) {
    const {
        pathname,
        query: { object },
    } = useRouter();

    const [uidsGroup, setUidsGroup] = useState([]);

    const {
        stateForm: { storeObjects, forms },
        dispatchForm: dispatch,
    } = useContext(AppContext);
    const formName = getFormName(pathname, object);

    const onGroupChange = async (e, uid) => {
        const { value: newValue } = e.target;
        const checkStoreObject = storeObjects.indexOf(formName) > -1;

        const payload = {
            value: newValue,
            uid,
            unSaved: false,
        };

        dispatch({
            type: 'UPDATE_FORM_FIELD',
            payload: { ...payload, formName },
        });

        if (checkStoreObject) {
            await DBService.set(payload, formName);
        }

        // group field
        const groupUid = getUniqueId(formName, subObject, validatorId);

        const groupValues = uidsGroup.flatMap((uidg) => {
            const fieldValue = getFieldValue(forms, formName, uidg);

            return uid !== uidg && fieldValue ? fieldValue : [];
        });

        const groupPayload = {
            value: [...groupValues, newValue],
            uid: groupUid,
            unSaved: true,
        };

        dispatch({
            type: 'UPDATE_FORM_FIELD',
            payload: { ...groupPayload, formName },
        });

        if (checkStoreObject) {
            await DBService.set(groupPayload, formName);
        }
    };

    const fields = content.map((field) => {
        const { type, title, validatorId, staticValues, infinite, value } =
            field;
        const subObjectType = getSubObjectType(subObject);
        const validatorConfig = configValidators[object][subObjectType]
            ? configValidators[object][subObjectType][validatorId]
            : null;

        return (
            <Col key={title} n="6">
                {
                    <SwitchField
                        type={validatorConfig ? type : null}
                        title={title}
                        onGroupChange={onGroupChange}
                        validatorId={validatorId}
                        updateValidSection={updateValidSection}
                        hint={hint}
                        infinite={infinite}
                        section={section}
                        value={value}
                        subObject={subObject}
                        staticValues={staticValues}
                    />
                }
            </Col>
        );
    });

    useEffect(() => {
        setUidsGroup(
            content.map((field) =>
                getUniqueId(formName, subObject, field.validatorId)
            )
        );
    }, [content, formName, subObject]);

    return (
        <Container fluid>
            <Row gutters>
                <Col n="12">{title}</Col>
                {fields}
            </Row>
        </Container>
    );
}

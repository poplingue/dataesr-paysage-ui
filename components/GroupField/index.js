import { Col, Container, Row } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';
import { configValidators } from '../../config/objects';
import { AppContext } from '../../context/GlobalState';
import {
    checkFlatMap,
    getFieldValue,
    getFormName,
    getSubObjectType,
    getUniqueId,
    matchRegex,
} from '../../helpers/utils';
import DBService from '../../services/DB.service';
import SwitchField from '../SwitchField';

export default function GroupField({
    validatorId,
    content,
    suggest,
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
    const checkStoreObject = storeObjects.indexOf(formName) > -1;

    const updateData = useCallback(
        async ({ uid, value }) => {
            const payload = {
                value,
                uid,
                unSaved: true,
            };

            dispatch({
                type: 'UPDATE_FORM_FIELD',
                payload: { ...payload, formName },
            });

            if (checkStoreObject) {
                await DBService.set(payload, formName);
            }
        },
        [checkStoreObject, dispatch, formName]
    );

    const onGroupChange = async (e, uid) => {
        const { value: newValue } = e.target;

        await updateData({ value: newValue, uid });

        await updateGroupData({ fieldUid: uid, newValue });
    };

    const updateGroupData = useCallback(
        async ({ fieldUid = '', newValue }) => {
            // group field
            const groupUid = getUniqueId(formName, subObject, validatorId);
            const fieldValue = getFieldValue(forms, formName, groupUid) || {
                lat: '',
                lng: '',
            };
            const field = matchRegex(`([^\_]+)$`, fieldUid);

            // array of group values
            const groupValues = uidsGroup.flatMap((uidGroup) => {
                const groupValue = getFieldValue(forms, formName, uidGroup);

                return checkFlatMap[fieldUid !== uidGroup && !!groupValue](
                    parseFloat(groupValue)
                );
            });

            // TODO make generic (and handle coordinates)
            const coordinates = newValue
                ? { ...groupValues, [field]: parseFloat(newValue) }
                : { lat: groupValues[1], lng: groupValues[0] };

            if (
                coordinates.lat !== fieldValue.lat ||
                coordinates.lng !== fieldValue.lng
            ) {
                await updateData({ value: coordinates, uid: groupUid });
            }
        },
        [formName, forms, subObject, uidsGroup, updateData, validatorId]
    );

    useEffect(() => {
        async function update() {
            await updateGroupData({});
        }

        update();
    }, [updateGroupData]);

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
                        suggest={suggest}
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

import { Text } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useCallback, useContext, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { fetchHelper } from '../../helpers/fetch';
import grid from '../../helpers/imports';
import {
    camelCase,
    cleanString,
    getField,
    getFormName,
    getSubObjectId,
    getSubObjectType,
    getUniqueId,
    range,
} from '../../helpers/utils';
import useCSSProperty from '../../hooks/useCSSProperty';
import DBService from '../../services/DB.service';
import NotifService from '../../services/Notif.service';
import FieldButton from '../FieldButton';
import DeleteButton from '../InfiniteAccordion/DeleteButton';
import styles from './CustomDate.module.scss';
import DateBlock from './DateBlock';

export default function CustomDate({
    title,
    updateValidSection,
    subObject,
    validatorId,
}) {
    const { Col, Row, Container } = grid();

    const validator = cleanString(validatorId);
    const days = range(1, 31, true);
    const months = range(1, 12, true);
    const years = range(1930, 2030, true);
    const [newValueCheck, setNewValueCheck] = useState(false);
    const { style: grey } = useCSSProperty('--grey-1000-50');
    const {
        stateForm: { forms, storeObjects, updateObjectId },
        dispatchForm: dispatch,
    } = useContext(AppContext);

    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);
    const uid = getUniqueId(formName, subObject, validatorId);
    const currenField = getField(forms, formName, uid);
    const camelValidator = camelCase(validatorId);
    const daysObj = {
        options: days,
        fieldId: `${camelValidator}Day`,
        title: `Jour`,
        regex: '[^-]*$',
        selectedValue: '',
    };
    const monthsObj = {
        options: months,
        fieldId: `${camelValidator}Month`,
        title: `Mois`,
        regex: '(?<=-).*(?=-)',
        selectedValue: '',
    };
    const yearsObj = {
        options: years,
        fieldId: `${camelValidator}Year`,
        title: `Année`,
        regex: '[\\s\\S]*?(?=-)',
        selectedValue: '',
    };

    const initDateData = [daysObj, monthsObj, yearsObj];

    const updateDate = useCallback(
        async (payload) => {
            dispatch({ type: 'UPDATE_FORM_FIELD', payload });

            const checkStoreObject = storeObjects.indexOf(formName) > -1;

            if (checkStoreObject) {
                await DBService.set(payload, formName);
            }
        },
        [dispatch, formName, storeObjects]
    );

    const [dateData, setDateData] = useState(initDateData);

    const automaticDate = async (when) => {
        const now = new Date();
        let newDate;
        const currentYear = now.getFullYear().toString();
        const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
        const currentDay = now.getDate().toString().padStart(2, '0');

        if (when === 'today') {
            newDate = [
                { ...daysObj, selectedValue: currentDay },
                { ...monthsObj, selectedValue: currentMonth },
                { ...yearsObj, selectedValue: currentYear },
            ];
        } else {
            newDate = [
                { ...daysObj, selectedValue: '01' },
                { ...monthsObj, selectedValue: '01' },
                { ...yearsObj, selectedValue: currentYear },
            ];
        }

        setDateData(newDate);

        updateValidSection(null, null);
        setNewValueCheck(!newValueCheck);

        // Save xxxx-xx-xx
        const payload = {
            value: `${currentYear}-${currentMonth}-${currentDay}`,
            uid,
            formName,
            unSaved: true,
        };

        await updateDate(payload);
    };

    const deleteDate = async () => {
        const uids = [
            uid,
            getUniqueId(formName, subObject, `${camelValidator}Day`),
            getUniqueId(formName, subObject, `${camelValidator}Month`),
            getUniqueId(formName, subObject, `${camelValidator}Year`),
        ];

        dispatch({
            type: 'DELETE_FORM_FIELD_LIST',
            payload: {
                uids,
                formName,
            },
        });

        await DBService.deleteList(uids, formName);

        // TODO move to ServiceForm
        const requestOptions = fetchHelper.requestOptions('PATCH', {
            [validatorId]: '',
        });
        const subObjectType = getSubObjectType(subObject);
        const subObjectId = getSubObjectId(subObject);

        const response = await fetch(
            `/api/structure/${updateObjectId}/${subObjectType}/${subObjectId}`,
            requestOptions
        );

        await response.json();

        setDateData(initDateData);

        NotifService.info('Date supprimée', 'valid');
    };

    return (
        <section className="wrapper-select">
            <Container fluid>
                <Row
                    gutters
                    alignItems="middle"
                    className={styles.Background}
                    spacing="mb-1v"
                >
                    <Col n="12" spacing="pb-1w">
                        <Text spacing="mb-1w" size="md">
                            {title}
                        </Text>
                    </Col>
                    <Col n="10 xl-3" spacing="p-1w">
                        <Container fluid>
                            <Row gutters>
                                <Col n="4 xl-12">
                                    <FieldButton
                                        dataTestId={`today-${validator}`}
                                        title="Aujourd'hui"
                                        onClick={() => automaticDate('today')}
                                    />
                                </Col>
                                <Col n="4 xl-12">
                                    <FieldButton
                                        dataTestId={`firstJanuary-${validator}`}
                                        title="1er janvier"
                                        onClick={() =>
                                            automaticDate('firstJanuary')
                                        }
                                    />
                                </Col>
                                {currenField && (
                                    <Col n="4 xl-12">
                                        <DeleteButton
                                            background={grey}
                                            display
                                            onClick={deleteDate}
                                            title={validatorId}
                                        />
                                    </Col>
                                )}
                            </Row>
                        </Container>
                    </Col>
                    <Col n="12 xl-9">
                        <Row gutters>
                            <DateBlock
                                updateValidSection={updateValidSection}
                                setNewValueCheck={setNewValueCheck}
                                newValueCheck={newValueCheck}
                                validatorId={validatorId}
                                updateDate={updateDate}
                                data={dateData}
                                subObject={subObject}
                            />
                        </Row>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}

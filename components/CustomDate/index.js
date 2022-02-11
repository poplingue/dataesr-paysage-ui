import { Text } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useCallback, useContext, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { fetchHelper } from '../../helpers/fetch';
import grid from '../../helpers/imports';
import {
    camelCase,
    cleanString,
    getFieldValue,
    getFormName,
    getUniqueId,
    lastChar,
    range,
    sliceEnd,
} from '../../helpers/utils';
import useCSSProperty from '../../hooks/useCSSProperty';
import DBService from '../../services/DB.service';
import NotifService from '../../services/Notif.service';
import CustomSelect from '../CustomSelect';
import FieldButton from '../FieldButton';
import DeleteButton from '../InfiniteAccordion/DeleteButton';
import styles from './CustomDate.module.scss';

export default function CustomDate({
    title,
    section,
    validatorConfig,
    updateValidSection,
    subObject,
    validatorId,
}) {
    const { Col, Row, Container } = grid();

    const d = new Date();
    const days = range(1, 31, true);
    const months = range(1, 12, true);
    const years = range(1930, 2030, true);
    const [newValueCheck, setNewValueCheck] = useState(false);
    const {
        stateForm: { storeObjects, forms, updateObjectId },
        dispatchForm: dispatch,
    } = useContext(AppContext);
    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);
    const uid = getUniqueId(formName, subObject, validatorId);
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

            setTimeout(async () => {
                const checkStoreObject = storeObjects.indexOf(formName) > -1;

                if (checkStoreObject) {
                    await DBService.set(payload, formName);
                }
            }, 0);
        },
        [dispatch, formName, storeObjects]
    );

    const onChange = useCallback(
        async (regex, fieldId, params) => {
            const [value, updateCheck] = params;
            const dateValue =
                getFieldValue(forms, formName, uid) || 'yyyy-mm-dd';
            const reg = new RegExp(regex);
            const newValue = dateValue.replace(reg, value);
            const currentDateValue = dateValue.match(reg);
            const fieldUid = getUniqueId(formName, subObject, fieldId);
            const currentFieldValue = getFieldValue(forms, formName, fieldUid);

            // Save full date xxxx-xx-xx
            if (currentDateValue && currentDateValue[0] !== value) {
                await updateDate({
                    value: newValue,
                    uid,
                    formName,
                    unSaved: true,
                });
            }

            // Save field (day, month or year)
            if (currentFieldValue !== value) {
                await updateDate({
                    value,
                    uid: fieldUid,
                    formName,
                    unSaved: true,
                });
            }

            if (updateCheck !== undefined) {
                setNewValueCheck(updateCheck);
            }
        },
        [formName, forms, subObject, uid, updateDate]
    );
    const [dateData, setDateData] = useState(initDateData);

    const automaticDate = async (when) => {
        const now = new Date();
        let newDate;
        const currentYear = now.getFullYear().toString();
        const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
        const currentDay = now.getDate().toString().padStart(2, '0');

        updateValidSection(null, null);
        setNewValueCheck(!newValueCheck);

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

        // Save xxxx-xx-xx
        const payload = {
            value: `${currentYear}-${currentMonth}-${currentDay}`,
            uid,
            formName,
            unSaved: true,
        };

        await updateDate(payload).then(() => {
            console.log('==== updated ==== ');
        });
    };

    const reset = async () => {
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

        setDateData(initDateData);

        // TODO move to ServiceForm
        const requestOptions = fetchHelper.requestOptions('PATCH', {
            [validatorId]: '',
        });
        const subObjectType = sliceEnd(subObject);
        const subObjectId = lastChar(subObject);

        const response = await fetch(
            `/api/structure/${updateObjectId}/${subObjectType}/${subObjectId}`,
            requestOptions
        );

        await response.json();

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
                                        dataTestId={`today-${cleanString(
                                            validatorId
                                        )}`}
                                        title="Aujourd'hui"
                                        onClick={() => automaticDate('today')}
                                    />
                                </Col>
                                <Col n="4 xl-12">
                                    <FieldButton
                                        dataTestId={`firstJanuary-${cleanString(
                                            validatorId
                                        )}`}
                                        title="1er janvier"
                                        onClick={() =>
                                            automaticDate('firstJanuary')
                                        }
                                    />
                                </Col>
                                <Col n="4 xl-12">
                                    <DeleteButton
                                        background={
                                            useCSSProperty('--grey-950-100')
                                                .style
                                        }
                                        display
                                        onClick={reset}
                                        title={validatorId}
                                    />
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                    <Col n="12 xl-9">
                        <Row gutters>
                            {dateData.map((select) => {
                                const {
                                    selectedValue,
                                    options,
                                    regex,
                                    fieldId,
                                    title,
                                } = select;

                                return (
                                    <Col
                                        n="12 xl-4"
                                        key={title}
                                        spacing="py-1w"
                                    >
                                        <CustomSelect
                                            customOnChange={(...params) =>
                                                onChange(regex, fieldId, params)
                                            }
                                            updateValidSection={
                                                updateValidSection
                                            }
                                            validatorConfig={validatorConfig}
                                            section={section}
                                            title={title}
                                            validatorId={fieldId}
                                            staticValues={options}
                                            newValue={selectedValue}
                                            newValueCheck={newValueCheck}
                                            subObject={subObject}
                                        />
                                    </Col>
                                );
                            })}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}

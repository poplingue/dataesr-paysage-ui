import { Text } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import {
    camelCase,
    cleanString,
    getField,
    getFormName,
    getUniqueId,
    range,
} from '../../helpers/utils';
import useCSSProperty from '../../hooks/useCSSProperty';
import { dataFormService } from '../../services/DataForm.service';
import DBService from '../../services/DB.service';
import NotifService from '../../services/Notif.service';
import FieldButton from '../FieldButton';
import { FieldDependency } from '../FieldDependencie';
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
    const now = new Date();
    const yearNow = now.getFullYear();
    const years = range(1970, yearNow + 10, true);
    const [newValueCheck, setNewValueCheck] = useState(false);
    const [anteriorYear, setAnteriorYear] = useState(false);
    const { style: grey } = useCSSProperty('--grey-1000-50');
    const {
        stateForm: { forms, storeObjects, updateObjectId, fieldsMode },
        dispatchForm: dispatch,
    } = useContext(AppContext);
    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);
    const uid = getUniqueId(formName, subObject, validatorId);
    const currentField = getField(forms, formName, uid) || undefined;
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
        title: `Ann??e`,
        regex: '[\\s\\S]*?(?=-)',
        selectedValue: '',
    };

    const initDateData = [daysObj, monthsObj, yearsObj];
    const [dateData, setDateData] = useState(initDateData);

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

        // clean fieldsMode object
        dispatch({ type: 'DELETE_FIELDS_MODE', payload: uids });

        await DBService.deleteList(uids, formName);

        dataFormService
            .deleteField(object, updateObjectId, subObject, validatorId, '')
            .then(() => {
                setDateData(initDateData);
                NotifService.info('Date supprim??e', 'valid');
            });
    };

    useEffect(() => {
        const anterior = {
            true: (v) => setAnteriorYear(v),
            false: () => {},
        };

        if (fieldsMode[`${uid}Year`]) {
            const checkInput =
                fieldsMode[`${uid}Year`].mode === 'input' && !anteriorYear;
            const checkSelect =
                fieldsMode[`${uid}Year`].mode === 'select' && anteriorYear;

            anterior[checkInput](true);
            anterior[checkSelect](false);
        }

        // if (
        //     fieldsMode[`${uid}Year`] &&
        //     fieldsMode[`${uid}Year`].mode === 'input' &&
        //     !anteriorYear
        // ) {
        //     setAnteriorYear(true);
        // }
        //
        // if (
        //     fieldsMode[`${uid}Year`] &&
        //     fieldsMode[`${uid}Year`].mode === 'select' &&
        //     anteriorYear
        // ) {
        //     setAnteriorYear(false);
        // }
    }, [anteriorYear, fieldsMode, uid]);

    return (
        <FieldDependency subObject={subObject} validatorId={validatorId}>
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
                        <Col n="12 xl-3" spacing="p-1w">
                            <Container fluid>
                                <Row gutters>
                                    <Col n="xs-6 md-4 xl-12">
                                        <FieldButton
                                            disabled={anteriorYear}
                                            dataTestId={`today-${validator}-${subObject}`}
                                            title="Aujourd'hui"
                                            onClick={() =>
                                                automaticDate('today')
                                            }
                                        />
                                    </Col>
                                    <Col n="xs-6 md-4 xl-12">
                                        <FieldButton
                                            disabled={anteriorYear}
                                            dataTestId={`firstJanuary-${validator}-${subObject}`}
                                            title="1er janvier"
                                            onClick={() =>
                                                automaticDate('firstJanuary')
                                            }
                                        />
                                    </Col>
                                    <Col n="xs-12 md-4 xl-12">
                                        <DeleteButton
                                            dataTestId={`btn-delete-${validator}-${subObject}`}
                                            background={grey}
                                            display
                                            disabled={!currentField}
                                            onClick={deleteDate}
                                            title={validatorId}
                                        />
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                        <Col n="12 xl-9">
                            <DateBlock
                                updateValidSection={updateValidSection}
                                setNewValueCheck={setNewValueCheck}
                                newValueCheck={newValueCheck}
                                validatorId={validatorId}
                                updateDate={updateDate}
                                data={dateData}
                                subObject={subObject}
                            />
                        </Col>
                    </Row>
                </Container>
            </section>
        </FieldDependency>
    );
}

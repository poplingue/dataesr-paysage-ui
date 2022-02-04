import { Text } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import {
    camelCase,
    cleanString,
    getFieldValue,
    getFormName,
    getUniqueId,
    range,
} from '../../helpers/utils';
import DBService from '../../services/DB.service';
import CustomSelect from '../CustomSelect';
import FieldButton from '../FieldButton';

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
    const years = range(1900, d.getFullYear(), true);
    const [newValueCheck, setNewValueCheck] = useState(false);
    const {
        stateForm: { storeObjects, forms },
        dispatchForm: dispatch,
    } = useContext(AppContext);
    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);
    const uid = getUniqueId(formName, subObject, validatorId);

    const onChange = async (regex, fieldId, params) => {
        const [value, updateCheck] = params;
        const fieldValue = getFieldValue(forms, formName, uid) || 'xxxx-xx-xx';
        const reg = new RegExp(regex);
        const newValue = fieldValue.replace(reg, value);
        const currentValue = fieldValue.match(reg);
        const checkStoreObject = storeObjects.indexOf(formName) > -1;

        // TODO manage select empty?
        // TODO refacto with CustomSelect

        // Save xxxx-xx-xx
        if (currentValue[0] !== value) {
            const payloadA = {
                value: newValue,
                uid,
                formName,
                unSaved: true,
            };

            if (value) {
                dispatch({ type: 'UPDATE_FORM_FIELD', payload: payloadA });

                if (checkStoreObject) {
                    await DBService.set(payloadA, formName).then(() => {
                        // NotifService.techInfo('Select field updated');
                    });
                }
            } else {
                dispatch({ type: 'DELETE_FORM_FIELD', payload: payloadA });

                await DBService.delete(uid, formName).then(() => {
                    // NotifService.techInfo('Select field deleted');
                });
            }

            if (updateCheck !== undefined) {
                setNewValueCheck(updateCheck);
            }
        }

        const payloadB = {
            value,
            uid: getUniqueId(formName, subObject, fieldId),
            formName,
            unSaved: false,
        };

        if (value) {
            dispatch({ type: 'UPDATE_FORM_FIELD', payload: payloadB });

            if (checkStoreObject) {
                await DBService.set(payloadB, formName).then(() => {
                    // NotifService.techInfo('Select field updated');
                });
            }
        } else {
            dispatch({ type: 'DELETE_FORM_FIELD', payload: payloadB });

            await DBService.delete(uid, formName).then(() => {
                // NotifService.techInfo('Select field deleted');
            });
        }
    };

    const [dateData, setDateData] = useState([
        {
            options: days,
            fieldId: `${camelCase(title)}Day`,
            title: `Jour`,
            regex: '[^-]*$',
            selectedValue: '',
        },
        {
            options: months,
            fieldId: `${camelCase(title)}Month`,
            title: `Mois`,
            regex: '(?<=-).*(?=-)',
            selectedValue: '',
        },
        {
            options: years,
            fieldId: `${camelCase(title)}Year`,
            title: `Année`,
            regex: '[\\s\\S]*?(?=-)',
            selectedValue: '',
        },
    ]);

    const automaticDate = (when) => {
        const now = new Date();
        let newDate;
        setNewValueCheck(!newValueCheck);
        updateValidSection(null, null);

        if (when === 'today') {
            newDate = [
                {
                    options: days,
                    fieldId: `${camelCase(title)}Day`,
                    title: `Jour`,
                    regex: '[^-]*$',
                    selectedValue: now.getDate().toString(),
                },
                {
                    options: months,
                    fieldId: `${camelCase(title)}Month`,
                    title: `Mois`,
                    regex: '(?<=-).*(?=-)',
                    selectedValue: (now.getMonth() + 1).toString(),
                },
                {
                    options: years,
                    fieldId: `${camelCase(title)}Year`,
                    title: `Année`,
                    regex: '[\\s\\S]*?(?=-)',
                    selectedValue: now.getFullYear().toString(),
                },
            ];
        } else {
            newDate = [
                {
                    options: days,
                    fieldId: `${camelCase(title)}Day`,
                    title: `Jour`,
                    regex: '[^-]*$',
                    selectedValue: '01',
                },
                {
                    options: months,
                    fieldId: `${camelCase(title)}Month`,
                    title: `Mois`,
                    regex: '(?<=-).*(?=-)',
                    selectedValue: '01',
                },
                {
                    options: years,
                    fieldId: `${camelCase(title)}Year`,
                    title: `Année`,
                    regex: '[\\s\\S]*?(?=-)',
                    selectedValue: now.getFullYear().toString(),
                },
            ];
        }

        setDateData(newDate);
    };

    return (
        <section className="wrapper-select">
            <Container fluid>
                <Row gutters alignItems="middle">
                    <Col n="12" spacing="pb-1w">
                        <Text spacing="mb-1w" size="md">
                            {title}
                        </Text>
                    </Col>
                    <Col n="8 xl-3" spacing="p-1w">
                        <Container fluid>
                            <Row gutters>
                                <Col n="4 xl-12">
                                    <FieldButton
                                        dataTestId={`today-${cleanString(
                                            section
                                        )}`}
                                        title="Aujourd'hui"
                                        onClick={() => automaticDate('today')}
                                    />
                                </Col>
                                <Col n="4 xl-12">
                                    <FieldButton
                                        dataTestId={`firstJanuary-${cleanString(
                                            section
                                        )}`}
                                        title="1er janvier"
                                        onClick={() =>
                                            automaticDate('firstJanuary')
                                        }
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

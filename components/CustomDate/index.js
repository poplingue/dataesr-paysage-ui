import { Col, Container, Row } from '@dataesr/react-dsfr';
import { useState } from 'react';
import { cleanString, range } from '../../helpers/utils';
import CustomSelect from '../CustomSelect';
import FieldButton from '../FieldButton';

export default function CustomDate({
    title,
    section,
    index,
    validatorConfig,
    updateValidSection,
}) {
    const d = new Date();
    const days = range(1, 31, true);
    const months = range(1, 12, true);
    const years = range(1900, d.getFullYear(), true);
    const [newValueCheck, setNewValueCheck] = useState(false);
    const [dateData, setDateData] = useState([
        {
            options: days,
            title: `${title} day`,
            selectedValue: '',
        },
        {
            options: months,
            title: `${title} month`,
            selectedValue: '',
        },
        {
            options: years,
            title: `${title} year`,
            selectedValue: '',
        },
    ]);

    const automaticDate = (when) => {
        const now = new Date();
        let newDate = null;
        setNewValueCheck(!newValueCheck);
        updateValidSection(null, null);

        if (when === 'today') {
            newDate = [
                {
                    options: days,
                    title: `${title} day`,
                    selectedValue: now.getDate().toString(),
                },
                {
                    options: months,
                    title: `${title} month`,
                    selectedValue: (now.getMonth() + 1).toString(),
                },
                {
                    options: years,
                    title: `${title} year`,
                    selectedValue: now.getFullYear().toString(),
                },
            ];
        } else {
            newDate = [
                {
                    options: days,
                    title: `${title} day`,
                    selectedValue: '01',
                },
                {
                    options: months,
                    title: `${title} month`,
                    selectedValue: '01',
                },
                {
                    options: years,
                    title: `${title} year`,
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
                    {dateData.map((select) => {
                        const { title, selectedValue, options } = select;

                        return (
                            <Col n="12 md-2" key={title} spacing="py-1w">
                                <CustomSelect
                                    updateValidSection={updateValidSection}
                                    validatorConfig={validatorConfig}
                                    section={section}
                                    index={index}
                                    title={title}
                                    staticValues={options}
                                    newValue={selectedValue}
                                    newValueCheck={newValueCheck}
                                    updateCheck={(v) => setNewValueCheck(v)}
                                />
                            </Col>
                        );
                    })}
                    <Col n="6">
                        <Container fluid>
                            <Row>
                                <Col n="4">
                                    <FieldButton
                                        dataTestId={`today-${cleanString(
                                            section
                                        )}`}
                                        title="Aujourd'hui"
                                        onClick={() => automaticDate('today')}
                                    />
                                </Col>
                                <Col n="4">
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
                </Row>
            </Container>
        </section>
    );
}

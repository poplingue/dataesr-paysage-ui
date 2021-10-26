import { Col, Container, Row } from '@dataesr/react-dsfr'
import { useState } from 'react'
import { cleanString, range } from '../../helpers/utils'
import CustomSelect from '../CustomSelect'
import FieldButton from '../FieldButton'

export default function CustomDate({ title, parentsection, keynumber }) {
    const days = range(1, 31, true)
    const months = range(1, 12, true)
    const years = range(1900, 2021, true)
    const [newValueCheck, setNewValueCheck] = useState(false)
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
    ])

    const automaticDate = when => {
        const now = new Date()
        let newDate = null
        setNewValueCheck(!newValueCheck)

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
            ]
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
            ]
        }

        setDateData(newDate)
    }

    return (
        <section className="wrapper-select py-10">
            <Container fluid>
                <Row gutters alignItems="middle">
                    {dateData.map(select => {
                        return (
                            <Col n="12 md-2" key={select.title}>
                                <CustomSelect
                                    parentsection={parentsection}
                                    keynumber={keynumber}
                                    title={select.title}
                                    staticValues={select.options}
                                    newValue={select.selectedValue}
                                    newValueCheck={newValueCheck}
                                    updateCheck={v => setNewValueCheck(v)}
                                />
                            </Col>
                        )
                    })}
                    <Col n="6">
                        <Container fluid>
                            <Row>
                                <Col n="4">
                                    <FieldButton
                                        dataTestid={`today-${cleanString(
                                            parentsection
                                        )}`}
                                        title="Aujourd'hui"
                                        onClick={() => automaticDate('today')}
                                    />
                                </Col>
                                <Col n="4">
                                    <FieldButton
                                        dataTestid={`firstJanuary-${cleanString(
                                            parentsection
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
    )
}

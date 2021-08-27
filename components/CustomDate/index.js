import { Container, Row, Col } from '@dataesr/react-dsfr';
import { range } from '../../helpers/utils';
import CustomSelect from '../CustomSelect';

export default function CustomDate({ title, parentsection, keynumber }) {
    const days = range(1, 31, true);
    const months = range(1, 12, true);
    const years = range(1900, 2021, true);

    const dateData = [{
        options: days,
        title: `${title} day`
    }, {
        options: months,
        title: `${title} month`
    }, {
        options: years,
        title: `${title} year`
    }];

    return <section className="wrapper-select py-10">
        <Container fluid>
            <Row gutters>
                {dateData.map((select, i) => {
                    return <Col n="12 md-4" key={select.title}>
                        <CustomSelect
                            parentsection={parentsection}
                            keynumber={keynumber}
                            title={select.title}
                            staticValues={select.options}
                        />
                    </Col>;
                })}
            </Row>
        </Container>
    </section>;
}

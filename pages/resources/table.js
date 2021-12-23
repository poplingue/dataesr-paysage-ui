import { Col, Container, Row } from '@dataesr/react-dsfr';
import { useState } from 'react';

import 'react-tabulator/css/tabulator_materialize.min.css';
import 'react-tabulator/css/semantic-ui/tabulator_semantic-ui.min.css';

import HeaderLayout from '../../components/HeaderLayout';
import IconButton from '../../components/IconButton';
import Layout from '../../components/Layout';
import Table from '../../components/Table';

export default function Example() {
    const [data] = useState([
        { id: 1, name: 'Oli Bob', age: '12', col: 'red', dob: '' },
        { id: 2, name: 'Mary May', age: '1', col: 'blue', dob: '14/05/1982' },
        {
            id: 3,
            name: 'Christine Lobowski',
            age: '42',
            col: 'green',
            dob: '22/05/1982',
        },
        {
            id: 4,
            name: 'Brendon Philips',
            age: '125',
            col: 'orange',
            dob: '01/08/1980',
        },
        {
            id: 5,
            name: 'Margret Marmajuke',
            age: '16',
            col: 'yellow',
            dob: '31/01/1999',
        },
    ]);

    const [columns] = useState([
        {
            title: 'Name',
            field: 'name',
            width: 150,
            editor: 'input',
            headerFilter: 'input',
        },
        { title: 'Age', field: 'age', hozAlign: 'left', formatter: 'progress' },
        { title: 'Favourite Color', field: 'col' },
        { title: 'Date Of Birth', field: 'dob', hozAlign: 'center' },
    ]);

    return (
        <Layout>
            <HeaderLayout pageTitle="Un Tableau" />
            <Container>
                <Row gutters>
                    <Col n="12">
                        <Table columns={columns} data={data} />
                    </Col>
                    <Col>
                        <IconButton
                            square={false}
                            onClick={() => {}}
                            title="Ajouter un nouveau texte"
                            icon="ri-add-circle-line"
                        />
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}

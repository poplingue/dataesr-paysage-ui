import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { getObjectTypeDetails } from '../../../../config/utils';
import { AppContext } from '../../../../context/GlobalState';
import grid from '../../../../helpers/imports';

const Button = dynamic(() =>
    import('@dataesr/react-dsfr').then((mod) => mod.Button)
);
const ImportFile = dynamic(() => import('./../../../../components/ImportFile'));
const Table = dynamic(() => import('./../../../../components/Table'));
const Layout = dynamic(() => import('./../../../../components/Layout'));
const HeaderLayout = dynamic(() =>
    import('./../../../../components/HeaderLayout')
);

export default function Import() {
    const { Col, Row, Container } = grid();
    const {
        query: { object },
    } = useRouter();
    const { tableSchema, title } = getObjectTypeDetails('', object);

    const {
        statePage: { tableData },
    } = useContext(AppContext);

    const importToPaysage = () => {
        // TODO request API
        console.log('==== tableData ==== ', tableData);
    };

    return (
        <Layout>
            <HeaderLayout pageTitle={`Import en masse de ${title}s`} />
            <ImportFile objectType={object} />
            <Container>
                <Row gutters>
                    <Col n="12">
                        <Table columns={tableSchema} objectType={object}>
                            <Button
                                size="sm"
                                title="Importer dans Paysage"
                                onClick={importToPaysage}
                            >
                                Importer dans Paysage
                            </Button>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}

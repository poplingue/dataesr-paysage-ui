import { Toggle } from '@dataesr/react-dsfr';
import { useContext } from 'react';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import { ExcelService } from '../../services/Excel.service';
import FieldButton from '../FieldButton';
import List from '../List';

export default function ExportList({ children, selection }) {
    const { Col, Row, Container } = grid();

    const {
        stateList: { exportMode },
        dispatchList: dispatch,
    } = useContext(AppContext);

    const exportJsonToXLS = () => {
        ExcelService.downloadFile('list', selection);
    };

    return (
        <Container fluid>
            <Row>
                <Col n="12">
                    <Toggle
                        onChange={() =>
                            dispatch({
                                type: 'UPDATE_EXPORT_MODE',
                            })
                        }
                        checked={exportMode}
                        label="Mode export"
                        description="Exporter la liste"
                    />
                </Col>
                <Col n={exportMode ? '8' : '12'}>{children}</Col>
                {exportMode && (
                    <Col n="4">
                        <List>
                            {selection.map((s) => {
                                return <li key={s.name}>{s.name}</li>;
                            })}
                        </List>
                        <FieldButton
                            title="Exporter le fichier excel"
                            onClick={exportJsonToXLS}
                        />
                    </Col>
                )}
            </Row>
        </Container>
    );
}

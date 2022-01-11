import { Toggle } from '@dataesr/react-dsfr';
import { useContext } from 'react';
import XLSX from 'xlsx';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import FieldButton from '../FieldButton';
import List from '../List';

function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];

    this.Sheets = {};
}

export default function ExportList({ children, selection }) {
    const { Col, Row, Container } = grid();

    const {
        stateList: { exportMode },
        dispatchList: dispatch,
    } = useContext(AppContext);

    const download = (url, name) => {
        let a = document.createElement('a');
        a.href = url;
        a.download = name;
        a.click();

        window.URL.revokeObjectURL(url);
    };

    const s2ab = (s) => {
        const buf = new ArrayBuffer(s.length);

        const view = new Uint8Array(buf);

        for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;

        return buf;
    };

    const exportJson = (filename) => {
        const wb = new Workbook();
        const ws = XLSX.utils.json_to_sheet(selection);

        wb.SheetNames.push('shit');
        wb.Sheets['shit'] = ws;

        const wbout = XLSX.write(wb, {
            bookType: 'xlsx',
            bookSST: true,
            type: 'binary',
        });

        let url = window.URL.createObjectURL(
            new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
        );

        download(url, filename);
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
                            onClick={() => exportJson('excel.xls')}
                        />
                    </Col>
                )}
            </Row>
        </Container>
    );
}

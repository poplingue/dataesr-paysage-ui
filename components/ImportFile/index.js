import { File } from '@dataesr/react-dsfr';
import { useContext } from 'react';
import XLSX from 'xlsx';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import useViewport from '../../hooks/useViewport';
import styles from './ImportFile.module.scss';

export default function ImportFile({ objectType }) {
    const { Col, Row, Container } = grid();
    const { mobile } = useViewport();

    const { dispatchPage: dispatch } = useContext(AppContext);

    const processFile = async (file) => {
        try {
            return await readFileAsync(file);
        } catch (err) {
            console.log(err);
        }
    };

    const readFileAsync = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.readAsBinaryString(file);

            reader.onload = (e) => {
                resolve(e.target.result);
            };

            reader.onerror = reject;
        });

    const onUploadFile = async () => {
        let newData = null;
        const file = document.querySelector("[data-upload='file'] .fr-upload")
            .files[0];

        if (file) {
            processFile(file).then((data) => {
                const workbook = XLSX.read(data, { type: 'binary' });

                workbook.SheetNames.forEach((sheet, index) => {
                    newData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

                    dispatch({
                        type: 'UPDATE_TABLE_DATA',
                        payload: newData,
                    });
                });
            });
        }
    };

    return (
        <Container fluid={mobile} className={styles.ImportFile}>
            <Row gutters spacing="p-3w">
                <Col spacing="mb-5w">
                    <File
                        onChange={onUploadFile}
                        data-upload="file"
                        label={`Charger un fichier`}
                        hint="format .xls ou .xlsx"
                    />
                </Col>
            </Row>
        </Container>
    );
}

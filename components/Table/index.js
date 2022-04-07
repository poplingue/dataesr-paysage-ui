import 'react-tabulator/css/tabulator_materialize.min.css';
import 'react-tabulator/css/semantic-ui/tabulator_semantic-ui.min.css';
import { useContext } from 'react';
import { reactFormatter, ReactTabulator } from 'react-tabulator';
import FieldButton from '../../components/FieldButton';
import { getObjectTypeDetails } from '../../config/utils';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import useCSSProperty from '../../hooks/useCSSProperty';
import { ExcelService } from '../../services/Excel.service';

export default function Table({ columns = [], children, objectType }) {
    const { Col, Row } = grid();

    const {
        statePage: { tableData, user },
        dispatchPage: dispatch,
    } = useContext(AppContext);

    const deleteRow = (props) => {
        const { row } = props.cell._cell;
        const indexToDelete = [...row.element.parentNode.children].indexOf(
            row.element
        );
        const payload = tableData.filter((d, i) => i !== indexToDelete);

        row.delete();
        dispatch({
            type: 'UPDATE_TABLE_DATA',
            payload,
        });
    };

    const DeleteButton = (props) => {
        const { style: red } = useCSSProperty('--error-main-525');
        const { style: white } = useCSSProperty('--grey-1000');

        return (
            <FieldButton
                colors={[red, white]}
                onClick={() => deleteRow(props)}
                title="Supprimer"
            />
        );
    };

    const onXlsDownload = () => {
        const { title } = getObjectTypeDetails('', objectType);
        const fileName = `${title}_${user.username}`;

        ExcelService.downloadFile(fileName, tableData);
    };

    return (
        <Row>
            {!!columns.length && (
                <ReactTabulator
                    data={tableData}
                    columns={[
                        ...columns,
                        {
                            title: 'Action',
                            field: 'action',
                            formatter: reactFormatter(<DeleteButton />),
                        },
                    ]}
                />
            )}
            <Col n="4">
                <FieldButton
                    title="Télécharger les données"
                    onClick={onXlsDownload}
                />
            </Col>
            <Col n="4">{children}</Col>
        </Row>
    );
}

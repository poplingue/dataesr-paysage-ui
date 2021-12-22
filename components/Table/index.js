import 'react-tabulator/css/tabulator_materialize.min.css';
import 'react-tabulator/css/semantic-ui/tabulator_semantic-ui.min.css';
import { reactFormatter, ReactTabulator } from 'react-tabulator';
import FieldButton from '../../components/FieldButton';
import useCSSProperty from '../../hooks/useCSSProperty';

export default function Table({ columns, data }) {
    const deleteRow = (props) => {
        console.log('==== LOG ==== ', props.cell._cell.row.delete());
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

    return (
        <>
            <ReactTabulator
                data={data}
                columns={[
                    ...columns,
                    {
                        title: 'Custom',
                        field: 'custom',
                        formatter: reactFormatter(<DeleteButton />),
                    },
                ]}
            />
            <FieldButton
                title="Télécharger les données"
                onClick={() => console.debug('==== DEBUG ==== ', data)}
            />
        </>
    );
}

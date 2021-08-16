import { Button } from '@dataesr/react-dsfr';

export default function FieldButton({ title, onClick, dataTestId }) {
    return (
        <Button data-testid={dataTestId} size="sm" onClick={onClick}>{title}</Button>
    );
}

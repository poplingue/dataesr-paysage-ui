import { Button } from '@dataesr/react-dsfr';

export default function FieldButton({ title, onClick, datatestid }) {
    return (
        <Button data-testid={datatestid} size="sm" onClick={onClick}>{title}</Button>
    );
}

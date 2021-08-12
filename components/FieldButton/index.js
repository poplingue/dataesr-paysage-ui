import { Button } from '@dataesr/react-dsfr';

export default function FieldButton({ title, onClick }) {
    return (
        <Button size="sm" onClick={onClick}>{title}</Button>
    );
}

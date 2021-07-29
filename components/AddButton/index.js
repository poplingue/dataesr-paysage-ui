import { Button } from '@dataesr/react-dsfr';

export default function AddFieldButton({ title, onClick }) {
    return (
        <Button size="sm" onClick={onClick}>Add {title}</Button>
    );
}
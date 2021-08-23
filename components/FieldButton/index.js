import { Button } from '@dataesr/react-dsfr';

export default function FieldButton({ title, onClick, datatestid, icon }) {
    return (
        <Button
            icon={icon}
            data-testid={datatestid}
            size="sm"
            secondary
            onClick={onClick}>
            {title}
        </Button>
    );
}

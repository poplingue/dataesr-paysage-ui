import { Button } from '@dataesr/react-dsfr';

// TODO add proptypes
export default function FieldButton({
    title,
    onClick,
    dataTestid,
    icon,
    className,
}) {
    return (
        <Button
            className={className}
            icon={icon}
            data-testid={dataTestid}
            size="sm"
            secondary
            onClick={onClick}
        >
            {title}
        </Button>
    );
}

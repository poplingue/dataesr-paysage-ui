import { Button } from '@dataesr/react-dsfr';

// TODO add proptypes
export default function FieldButton({
    title,
    onClick,
    dataTestId,
    icon,
    className,
    disabled,
    colors,
}) {
    return (
        <Button
            disabled={disabled}
            className={className}
            icon={icon}
            data-testid={dataTestId}
            size="sm"
            secondary
            colors={colors}
            onClick={onClick}
        >
            {title}
        </Button>
    );
}

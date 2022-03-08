import { Button } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { noPrintClass } from '../../helpers/utils';

export default function FieldButton({
    title,
    onClick,
    dataTestId,
    icon,
    className,
    disabled,
    colors,
    submit,
}) {
    return (
        <Button
            submit={submit}
            disabled={disabled}
            className={`${className} ${noPrintClass}`}
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

FieldButton.defaultProps = {
    onClick: () => {},
    dataTestId: '',
    submit: false,
    icon: '',
    className: '',
    disabled: false,
    colors: [],
};

FieldButton.propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    submit: PropTypes.bool,
    dataTestId: PropTypes.string,
    icon: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    colors: PropTypes.arrayOf(PropTypes.string),
};

import { Button, TextInput } from '@dataesr/react-dsfr';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

function AuthForm({ schema, onSubmit, validationSchema }) {
    const formOptions = {
        resolver: yupResolver(validationSchema),
        mode: 'onChange',
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm(formOptions);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {schema.map((schema) => {
                const { name, label, type, required, hint, value, disabled } =
                    schema;

                return (
                    <TextInput
                        {...register(name, {
                            required: true,
                            disabled: false,
                            value,
                        })}
                        key={name}
                        value={value}
                        disabled={disabled}
                        label={label}
                        name={name}
                        type={type || undefined}
                        hint={hint || undefined}
                        required={required}
                        message={errors[name] && errors[name].message}
                        messageType={
                            errors[name] || errors[name]?.type === 'required'
                                ? 'error'
                                : ''
                        }
                    />
                );
            })}
            <Button title="Valider" submit disabled={isSubmitting}>
                Valider
            </Button>
        </form>
    );
}

AuthForm.propTypes = {
    schema: PropTypes.arrayOf(
        PropTypes.shape({
            required: PropTypes.bool.isRequired,
            label: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    onSubmit: PropTypes.func.isRequired,
    validationSchema: PropTypes.any.isRequired,
};

export default AuthForm;

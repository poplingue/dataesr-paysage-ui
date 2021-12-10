import { Button, TextInput } from '@dataesr/react-dsfr';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

// TODO add proptypes
export default function AuthForm({
    schema,
    onSubmit,
    validationSchema,
    disable,
}) {
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
                const { name, label, type, required, hint } = schema;

                return (
                    <TextInput
                        {...register(name, { required: true })}
                        key={name}
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
            <Button title="Valider" submit disabled={disable || isSubmitting}>
                Valider
            </Button>
        </form>
    );
}

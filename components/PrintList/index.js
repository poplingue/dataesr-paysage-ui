import { Checkbox, CheckboxGroup } from '@dataesr/react-dsfr';

export default function PrintList({ skeleton, updatePrintPage, legend }) {
    return (
        <CheckboxGroup ariaLabel={legend} legend={legend}>
            {skeleton.map((section) => {
                const { title, print } = section;

                return (
                    <Checkbox
                        key={title}
                        size="sm"
                        checked={print}
                        label={title}
                        value={title}
                        onChange={() => updatePrintPage(title)}
                    />
                );
            })}
        </CheckboxGroup>
    );
}

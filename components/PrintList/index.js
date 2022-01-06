import { Checkbox, CheckboxGroup } from '@dataesr/react-dsfr';

export default function PrintList({ skeleton, updatePrintPage, legend }) {
    return (
        <ul>
            <CheckboxGroup ariaLabel={legend} legend={legend}>
                {skeleton.map((section) => {
                    const { title, print } = section;

                    return (
                        <li key={title}>
                            <Checkbox
                                size="sm"
                                checked={print}
                                label={title}
                                value={title}
                                onChange={() => updatePrintPage(title)}
                            />
                        </li>
                    );
                })}
            </CheckboxGroup>
        </ul>
    );
}

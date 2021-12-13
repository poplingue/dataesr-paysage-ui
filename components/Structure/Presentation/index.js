import { Title } from '@dataesr/react-dsfr';
import { sectionUniqueId } from '../../../helpers/utils';
import Map from '../../Map';
import Contact from './Contact';
import Functions from './Functions';

const components = {
    functions: Functions,
    contact: Contact,
};

export default function Presentation({ title, content }) {
    // TODO wrapper dynamic component
    return (
        <>
            <Map adresses={[]} />
            téléphone | adresse info cards contacts génériques
            {content.map((subSection) => {
                const { title, component } = subSection;
                const dataSection = sectionUniqueId(title);
                const Component = components[component];

                return (
                    <div key={title} data-section={dataSection}>
                        <Title as="h3" look="h6">
                            {title}
                        </Title>
                        {Component && <Component />}
                    </div>
                );
            })}
        </>
    );
}

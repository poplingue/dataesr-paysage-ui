import { Accordion, AccordionItem, Icon } from '@dataesr/react-dsfr';
import CreateStructure from './create.json';
import Layout from '../../components/Layout';
import Switch from '../../components/Switch';

export default function Create() {
    return (
        <Layout>
            <div>
                <Icon
                    name="ri-bubble-chart-line"
                    size="1x">
                    <h1>Create 1 Person</h1>
                </Icon>
                <Accordion keepOpen>
                    {CreateStructure[0].form.map((section, i) => {
                        return <AccordionItem initExpand key={i} title={section.title}>
                            <div>
                                {section.content.map((field, j) => {
                                    const { type, title, infinite } = field;
                                    return <div key={j}>
                                        <Switch
                                            type={type}
                                            title={title}
                                            infinite={infinite}
                                        />
                                    </div>;
                                })}
                            </div>
                        </AccordionItem>;
                    })}
                </Accordion>
            </div>
        </Layout>
    );
}

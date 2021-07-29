import { Accordion, AccordionItem, Icon } from '@dataesr/react-dsfr';
import CreatePerson from './create.json';
import Layout from '../../components/Layout';
import styles from '../../styles/Person.module.scss';
import Switch from '../../components/Switch';
import { v4 as uuidv4 } from 'uuid';

export default function Create() {
    return (
        <Layout>
            <div className={styles.test}>
                <Icon
                    name="ri-bubble-chart-line"
                    size="1x">
                    <h1>Create 1 Person</h1>
                </Icon>
                <Accordion keepOpen>
                    {CreatePerson[0].form.map((section, i) => {
                        const { position, title, content } = section;
                        return <AccordionItem initExpand key={i} title={title} data-position={position}>
                            {content.map((field) => {
                                const { type, title, infinite, staticValues } = field;
                                return <section key={uuidv4()}>
                                    <Switch
                                        type={type}
                                        title={title}
                                        infinite={infinite}
                                        staticValues={staticValues}
                                    />
                                </section>;
                            })}
                        </AccordionItem>;
                    })}
                </Accordion>
            </div>
        </Layout>
    );
}

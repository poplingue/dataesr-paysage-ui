import { Accordion, AccordionItem, Col } from '@dataesr/react-dsfr';
import { PersonPageSkeleton } from '../../helpers/constants';
import { cleanString, sectionUniqueId } from '../../helpers/utils';
import useCSSProperty from '../../hooks/useCSSProperty';
import PageTheme from '../PageTheme';
import Identifier from './Identifier';
import Price from './Price';
import Responsability from './Responsability';
import Synthesis from './Synthesis/index';
import Web from './Web';

const components = {
    synthesis: Synthesis,
    responsability: Responsability,
    identifier: Identifier,
    web: Web,
    price: Price,
};

export default function Person({ fame, children }) {
    const { style: pink } = useCSSProperty('--pink-tuile-main-556');

    return (
        <PageTheme color={pink}>
            {children}
            <Col>
                <Accordion size="lg" color={pink} keepOpen>
                    {PersonPageSkeleton.map((elm) => {
                        const { content, title, component } = elm;

                        const dataSection = sectionUniqueId(
                            cleanString(title),
                            content.length
                        );
                        const Component = components[component];

                        return (
                            <AccordionItem
                                initExpand
                                title={title}
                                key={title}
                                data-section={dataSection}
                            >
                                {Component && (
                                    <Component
                                        title={title}
                                        content={content}
                                    />
                                )}
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </Col>
        </PageTheme>
    );
}

Person.getServerSideProps = () => {
    return {
        props: {
            name: 'Sœur Emmanuelle',
        },
    };
};

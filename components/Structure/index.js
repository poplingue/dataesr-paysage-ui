import { Accordion, AccordionItem, Col } from '@dataesr/react-dsfr';
import { StructurePageSkeleton } from '../../helpers/constants';
import { cleanString, sectionUniqueId } from '../../helpers/utils';
import useCSSProperty from '../../hooks/useCSSProperty';
import PageTheme from '../PageTheme';
import Identifier from './Identifier';
import styles from './Person.module.scss';
import Presentation from './Presentation/index';
import Price from './Price';
import Responsability from './Responsability';
import Web from './Web';

const components = {
    presentation: Presentation,
    responsability: Responsability,
    identifier: Identifier,
    web: Web,
    price: Price,
};

export default function Structure({ children }) {
    const { style: pink } = useCSSProperty('--green-tilleul-verveine-main-707');

    return (
        <PageTheme color={pink}>
            {children}
            <Col className={styles.Structure}>
                <Accordion size="lg" color={pink} keepOpen>
                    {StructurePageSkeleton.map((elm) => {
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
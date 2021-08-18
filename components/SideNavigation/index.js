import { Col, Container, Row, SideMenu, SideMenuLink } from '@dataesr/react-dsfr';
import { sectionUniqueId } from '../../helpers/utils';

export default function SideNavigation({ children, items }) {
    const goToSection = (e, dataSection) => {
        const section = document.querySelector(`[data-section=${dataSection}]`);
        const { left, top } = section.getBoundingClientRect();
        window.scrollTo(left, top + window.scrollY);
    };

    return (<Container>
        <Row>
            <Col n="12 md-3">
                <SideMenu
                    title="Navigation"
                    buttonLabel="Navigation"
                    className="fr-sidemenu--sticky">
                    {items.map((section) => {
                        const { title, content } = section;

                        return <SideMenuLink
                            onClick={(e) => goToSection(e, sectionUniqueId(title, content.length))}
                            href="/"
                            key={`${title}-${content.length}`}>{title}</SideMenuLink>;
                    })}
                </SideMenu>
            </Col>
            <Col n="12 md-9">
                {children}
            </Col>
        </Row>
    </Container>);
}

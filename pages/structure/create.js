import { Icon, SideMenu, SideMenuLink, Container, Col, Row } from '@dataesr/react-dsfr';
import CreateStructure from './create.json';
import Layout from '../../components/Layout';
import CreateForm from '../../components/CreateForm';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AppContext } from '../../context/GlobalState';
import { sectionUniqueId } from '../../helpers/utils';

export default function Create({ data }) {
    const { state, dispatch } = useContext(AppContext);
    const goToSection = (e, dataSection) => {
        const section = document.querySelector(`[data-section=${dataSection}]`);
        const { left, top } = section.getBoundingClientRect();
        window.scrollTo(left, top + window.scrollY);
    };
    useEffect(() => {
        if (data && !state.departments.length) {
            dispatch({ type: 'UPDATE_DEPARTMENTS', payload: data });
        }
    });
    return (
        <Layout>
            <div>
                <Icon
                    name="ri-bubble-chart-line"
                    size="1x">
                    <h1>Create 1 Structure</h1>
                </Icon>
                <Container>
                    <Row>
                        <Col n="12 md-3">
                            <SideMenu
                                title="Navigation"
                                buttonLabel="Navigation"
                                className="fr-sidemenu--sticky">
                                {CreateStructure[0].form.map((section) => {
                                    return <SideMenuLink
                                        onClick={(e) => goToSection(e, sectionUniqueId(section.title, section.content.length))}
                                        href="/"
                                        key={`${section.title}-${section.content.length}`}>{section.title}</SideMenuLink>;
                                })}
                            </SideMenu>
                        </Col>
                        <Col n="12 md-9">
                            <CreateForm jsonForm={CreateStructure[0]}/>
                        </Col>
                    </Row>
                </Container>

            </div>
        </Layout>
    );
}

export async function getStaticProps() {
    const res = await fetch(`https://geo.api.gouv.fr/departements?fields=nom,code,codeRegion`);
    const data = await res.json();

    if (!data) {
        return { notFound: true };
    }
    return { props: { data } };
}

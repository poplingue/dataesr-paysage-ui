import { Icon } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import HeaderLayout from '../../../../components/HeaderLayout';
import Layout from '../../../../components/Layout';
import NavLink from '../../../../components/NavLink';
import Person from '../../../../components/Person';
import SideNavigation from '../../../../components/SideNavigation';
import ToolBox from '../../../../components/ToolBox';
import { AppContext } from '../../../../context/GlobalState';
import { PersonPageSkeleton } from '../../../../helpers/constants';
import useCSSProperty from '../../../../hooks/useCSSProperty';

export default function Object(props) {
    const {
        statePage: { accordionSkeleton: skeleton },
        dispatchPage: dispatch,
    } = useContext(AppContext);

    const router = useRouter();
    const { id } = router.query;
    const { style: pink } = useCSSProperty('--pink-tuile-main-556');

    useEffect(() => {
        if (!skeleton.length) {
            dispatch({
                type: 'UPDATE_ACCORDION_SKELETON',
                payload: {
                    accordionSkeleton: PersonPageSkeleton,
                },
            });
        }
    }, [dispatch, skeleton]);

    return (
        <Layout>
            <HeaderLayout
                pageTitle="Une Personne"
                highlight="Last update on Tuesday 5th of September 2020"
            />
            <SideNavigation items={skeleton}>
                <Person
                    id={id}
                    fame={props.fame}
                    name={props.name}
                    skeleton={skeleton}
                >
                    <ToolBox
                        printer
                        accordions
                        initialSkeleton={PersonPageSkeleton}
                    >
                        <Icon name="ri-edit-line" color={pink}>
                            <NavLink
                                className="fs-14-24"
                                href={`/update/person/${id}`}
                            >
                                Modifier
                            </NavLink>
                        </Icon>
                    </ToolBox>
                </Person>
            </SideNavigation>
        </Layout>
    );
}

export async function getServerSideProps() {
    // fetch data Person by id
    return {
        props: {
            id: 0,
            name: 'Personne 0',
            fame: true,
        },
    };
}

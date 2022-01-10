import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { AppContext } from '../../../../context/GlobalState';
import { PersonPageSkeleton } from '../../../../helpers/constants';
import useCSSProperty from '../../../../hooks/useCSSProperty';

const Layout = dynamic(() => import('./../../../../components/Layout'));
const HeaderLayout = dynamic(() =>
    import('./../../../../components/HeaderLayout')
);
const ToolBox = dynamic(() => import('./../../../../components/ToolBox'));
const SideNavigation = dynamic(() =>
    import('./../../../../components/SideNavigation')
);
const NavLink = dynamic(() => import('./../../../../components/NavLink'));
const Person = dynamic(() => import('./../../../../components/Person'));
const Icon = dynamic(() =>
    import('@dataesr/react-dsfr').then((mod) => mod.Icon)
);

export default function Object(props) {
    const {
        statePage: { accordionSkeleton: skeleton },
        dispatchPage: dispatch,
    } = useContext(AppContext);

    const router = useRouter();
    const { id } = router.query;
    const { style: pink } = useCSSProperty('--pink-tuile-main-556');

    // TODO refacto - make a hook?
    useEffect(() => {
        return () => {
            dispatch({
                type: 'UPDATE_ACCORDION_SKELETON',
                payload: {
                    accordionSkeleton: [],
                },
            });
        };
    }, [dispatch]);

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
            <SideNavigation items={skeleton} color="Pink">
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

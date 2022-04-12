import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect } from 'react';
import {
    CategoryPageSkeleton,
    LegalCategoryPageSkeleton,
    PersonPageSkeleton,
    PricePageSkeleton,
    StructurePageSkeleton,
    TermPageSkeleton,
} from '../../../../config/objects';
import { getObjectTypeDetails } from '../../../../config/utils';
import { AppContext } from '../../../../context/GlobalState';
import ObjectService from '../../../../services/Object.service';

const Structure = dynamic(() => import('../../../../components/Structure'));
const LinkTo = dynamic(() => import('../../../../components/LinkTo'));
const LegalCategory = dynamic(() =>
    import('../../../../components/LegalCategory')
);
const Category = dynamic(() => import('../../../../components/Category'));
const Price = dynamic(() => import('../../../../components/Price'));
const Term = dynamic(() => import('../../../../components/Term'));
const Person = dynamic(() => import('../../../../components/Person'));
const ToolBox = dynamic(() => import('../../../../components/ToolBox'));
const SideNavigation = dynamic(() =>
    import('../../../../components/SideNavigation')
);
const HeaderLayout = dynamic(() =>
    import('../../../../components/HeaderLayout')
);
const Layout = dynamic(() => import('../../../../components/Layout'));

const templateObj = {
    structure: {
        component: Structure,
        skeleton: StructurePageSkeleton,
    },
    person: {
        component: Person,
        skeleton: PersonPageSkeleton,
    },
    category: {
        component: Category,
        skeleton: CategoryPageSkeleton,
    },
    price: {
        component: Price,
        skeleton: PricePageSkeleton,
    },
    term: {
        component: Term,
        skeleton: TermPageSkeleton,
    },
    legalCategory: {
        component: LegalCategory,
        skeleton: LegalCategoryPageSkeleton,
    },
};

export default function PaysageObject({ data }) {
    const {
        query: { id, type },
    } = useRouter();

    const { text, title, colorClassName } = getObjectTypeDetails('', type);
    const Component = templateObj[type] ? templateObj[type].component : null;
    const initSkeleton = templateObj[type] ? templateObj[type].skeleton : null;

    const {
        statePage: { accordionSkeleton: skeleton, currentPageObject },
        dispatchPage: dispatch,
    } = useContext(AppContext);

    const updateSkeleton = useCallback(
        (payload) => {
            dispatch({
                type: 'UPDATE_ACCORDION_SKELETON',
                payload,
            });
        },
        [dispatch]
    );

    useEffect(() => {
        return () => {
            updateSkeleton([]);
        };
    }, [updateSkeleton]);

    useEffect(() => {
        if (!skeleton.length) {
            updateSkeleton(initSkeleton);
        }
    }, [initSkeleton, skeleton, updateSkeleton]);

    useEffect(() => {
        if (!currentPageObject && data) {
            const proxy = new Proxy(data, ObjectService.handlerObjectInfo());

            dispatch({ type: 'UPDATE_CURRENT_PAGE_OBJECT', payload: proxy });
        }
    }, [currentPageObject, data, dispatch]);

    return (
        <Layout>
            <HeaderLayout
                pageTitle={
                    currentPageObject
                        ? `${currentPageObject.mainTitle}`
                        : `${title}`
                }
                status={data.status}
                type={title}
                id={id}
            />
            {Component && (
                <SideNavigation items={skeleton} color={colorClassName}>
                    <Component
                        id={id}
                        fame={data.fame}
                        name={!!Object.keys(data).length ? data.id : ''}
                        skeleton={skeleton}
                    >
                        <ToolBox
                            printer
                            accordions
                            initialSkeleton={initSkeleton}
                        >
                            <LinkTo
                                text={`modifier ${text}`}
                                href={`/contrib/${type}/${id}`}
                            />
                        </ToolBox>
                    </Component>
                </SideNavigation>
            )}
        </Layout>
    );
}

export async function getServerSideProps({ query }) {
    const data = (await ObjectService.getOne(query.type, query.id)) || {};

    return { props: { data } };
}

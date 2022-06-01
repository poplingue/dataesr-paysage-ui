import { Button } from '@dataesr/react-dsfr';
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

export default function PaysageObject() {
    const {
        query: { id, type },
    } = useRouter();
    const router = useRouter();
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
        if (skeleton && !skeleton.length) {
            updateSkeleton(initSkeleton);
        }
    }, [initSkeleton, skeleton, updateSkeleton]);

    useEffect(() => {
        async function getData() {
            return await ObjectService.getOne(type, id);
        }

        if (!Object.keys(currentPageObject).length && id && type) {
            getData().then((data) => {
                const proxy = new Proxy(
                    data,
                    ObjectService.handlerObjectInfo()
                );

                dispatch({
                    type: 'UPDATE_CURRENT_PAGE_OBJECT',
                    payload: proxy,
                });
            });
        }
    }, [currentPageObject, dispatch, id, type]);

    const linkTo = () => {
        router.push(`/contrib/${type}/${id}`);
    };

    return (
        <Layout>
            <HeaderLayout
                pageTitle={
                    currentPageObject
                        ? `${currentPageObject.mainTitle}`
                        : `${title}`
                }
                status={'test'}
                type={title}
                id={id}
            />
            {Component && (
                <SideNavigation items={skeleton} color={colorClassName}>
                    <Component
                        id={id}
                        name={
                            !!Object.keys(currentPageObject).length
                                ? currentPageObject.id
                                : ''
                        }
                        skeleton={skeleton}
                    >
                        <ToolBox
                            printer
                            accordions
                            initialSkeleton={initSkeleton}
                        >
                            <Button
                                size="sm"
                                tertiary
                                iconPosition="right"
                                icon="ri-arrow-right-line"
                                onClick={() => linkTo()}
                            >{`modifier ${text}`}</Button>
                        </ToolBox>
                    </Component>
                </SideNavigation>
            )}
        </Layout>
    );
}

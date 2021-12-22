import { Col, Container, Row } from '@dataesr/react-dsfr';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import SideNavigation from '../../components/SideNavigation';
import { AppContext } from '../../context/GlobalState';
import { getForm, getFormName } from '../../helpers/utils';
import useCSSProperty from '../../hooks/useCSSProperty';
import { dataFormService } from '../../services/DataForm.service';
import DBService from '../../services/DB.service';
import CreateForm from '../Form';
import HeaderLayout from '../HeaderLayout';
import LinkClick from '../LinkClick';
import ToolBox from '../ToolBox';
import CreatePersonForm from './form.json';

export default function CreatePerson({ data, id }) {
    const router = useRouter();
    const {
        stateForm: { forms },
        dispatchForm: dispatch,
    } = useContext(AppContext);
    const { style: pink } = useCSSProperty('--pink-tuile-main-556');
    const [personForm, setPersonForm] = useState(CreatePersonForm[0]);
    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);
    const currentForm = getForm(forms, formName);

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    useEffect(() => {
        if (id && currentForm.length > 0) {
            DBService.clear('update/person');
            dispatch({
                type: 'CLEAR_FORM',
                payload: { formName: 'update/person' },
            });
        }
    }, [currentForm.length, dispatch, id]);

    useEffect(() => {
        async function fetchPerson(id) {
            await delay(2000);

            return {
                id: id,
                identifiers: [
                    {
                        type: 'wikidata',
                        value: '123456',
                        active: true,
                        startDate: {
                            day: 'string',
                            month: 'string',
                            year: 'string',
                        },
                        endDate: {
                            day: 'string',
                            month: 'string',
                            year: 'string',
                        },
                        createdBy: 'string',
                        createdAt: '14:15:22Z',
                        updatedBy: 'string',
                        updatedAt: '14:15:22Z',
                    },
                ],
                firstName: 'Toutou',
                lastName: 'Youtou',
                otherName: ['string'],
                gender: {
                    type: 'Homme',
                },
                birthDate: {
                    day: 'string',
                    month: 'string',
                    year: 'string',
                },
                deathDate: {
                    day: 'string',
                    month: 'string',
                    year: 'string',
                },
                personPositions: [
                    {
                        structureId: {
                            identifierIds: [],
                            naming: {},
                            structureStatus: [],
                            legalPersonalities: [],
                            tutorships: [],
                            categories: [],
                            relatedElements: [],
                            visualIdentityElements: [],
                            analysis: [],
                            documents: [],
                            followUps: [],
                            personPriceIds: [],
                            webVisibility: [],
                            websitePages: {},
                            socialMedia: [],
                            internationalRanking: [],
                            newsCast: [],
                        },
                        positionId: {
                            otherNameFr: [],
                            otherNameEn: [],
                            officialDocumentId: {},
                            identifierIds: [],
                            webVisibility: [],
                            relatedElements: [],
                        },
                        interim: true,
                        access: 'Election',
                        mandateCount: '1',
                        duration: 'string',
                        genericEmail: 'string',
                        officielDocumentId: {
                            relatedIds: [],
                            link: {},
                            signatureDate: {},
                            startDate: {},
                            previsionalEndDate: {},
                            endDate: {},
                            personIds: [],
                            structureIds: [],
                        },
                        startDate: {},
                        endDate: {},
                        previsionalEndDate: {},
                        createdBy: 'string',
                        createdAt: '14:15:22Z',
                        updatedBy: 'string',
                        updatedAt: '14:15:22Z',
                    },
                ],

                personPrices: [
                    {
                        priceId: {
                            relatedElements: [],
                        },
                        structureIds: [{}],
                        date: {},
                        createdBy: 'string',
                        createdAt: '14:15:22Z',
                        updatedBy: 'string',
                        updatedAt: '14:15:22Z',
                    },
                ],
                activity: 'string',
                personPriceIds: ['string'],
                webVisibility: [
                    {
                        name: 'Portail HAL',
                        type: 'Portail HAL',
                        url: 'string',
                        language: 'français',
                        createdBy: 'string',
                        createdAt: '14:15:22Z',
                        updatedBy: 'string',
                        updatedAt: '14:15:22Z',
                    },
                ],
                socialMedia: [
                    {
                        type: 'Facebook',
                        account: 'string',
                        createdBy: 'string',
                        createdAt: '14:15:22Z',
                        updatedBy: 'string',
                        updatedAt: '14:15:22Z',
                    },
                ],
                newsCast: [
                    {
                        title: 'string',
                        articleNumber: 'string',
                        summary: 'string',
                        text: 'string',
                        date: {},
                        sourceType: 'AEF',
                        sourceUrl: 'string',
                        comment: 'string',
                        createdBy: 'string',
                        createdAt: '14:15:22Z',
                        updatedBy: 'string',
                        updatedAt: '14:15:22Z',
                    },
                ],
                comment: 'string',
                createdBy: 'string',
                createdAt: '14:15:22Z',
                updatedBy: 'string',
                updatedAt: '14:15:22Z',
            };
        }

        if (id) {
            fetchPerson(id).then((data) => {
                setPersonForm(
                    dataFormService.mapping(CreatePersonForm[0], data)
                );
            });
        }
    }, [id]);

    const onClick = (e) => {
        e.preventDefault();

        Cookies.remove('updateObjectId');

        DBService.clear('update/person');

        dispatch({
            type: 'CLEAR_FORM',
            payload: { formName: 'update/person' },
        });

        dispatch({
            type: 'UPDATE_UPDATE_OBJECT_ID',
            payload: { updateObjectId: '' },
        });

        router.push('/update/person');
    };

    return (
        <Layout>
            <HeaderLayout
                highlight={id ? 'Dernière modification le 23/03/2021' : ''}
                pageTitle={id ? `Modifier ${id}` : 'Ajouter une personne'}
            />
            <SideNavigation items={CreatePersonForm[0].form}>
                <ToolBox>
                    <Container>
                        <Row gutters spacing="pb-2w">
                            <Col>
                                {id && (
                                    <LinkClick
                                        href="/update/person"
                                        onClick={onClick}
                                        text="Ajouter une nouvelle personne"
                                    />
                                )}
                            </Col>
                        </Row>
                    </Container>
                </ToolBox>
                <CreateForm
                    jsonForm={id ? personForm : CreatePersonForm[0]}
                    color={pink}
                    objectFormType="person"
                />
            </SideNavigation>
        </Layout>
    );
}

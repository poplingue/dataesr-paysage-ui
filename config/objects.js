import PropTypes from 'prop-types';
import { configValidator as configValidatorPerson } from '../components/UpdatePerson/configValidator';
import { configValidator as configValidatorIdentifiers } from '../components/UpdateStructure/configValidatorIdentifiers';
import { configValidatorLocalisations } from '../components/UpdateStructure/configValidatorLocalisations';
import { configValidator as configValidatorNames } from '../components/UpdateStructure/configValidatorNames';

export const structureSubObjects = [
    { subObject: 'names', initBody: { usualName: '' } },
    { subObject: 'localisations', initBody: { country: '' } },
    {
        subObject: 'identifiers',
        initBody: {
            type: '',
            value: '',
            active: false,
        },
    },
];

export const configValidators = {
    structure: {
        identifiers: configValidatorIdentifiers,
        names: configValidatorNames,
        localisations: configValidatorLocalisations,
    },
    person: configValidatorPerson,
};

export const PersonPageSkeletonPropType = PropTypes.shape({
    web: PropTypes.func.isRequired,
    responsability: PropTypes.func.isRequired,
    identifier: PropTypes.func.isRequired,
    price: PropTypes.func.isRequired,
    synthesis: PropTypes.func.isRequired,
});

export const PersonPageSkeleton = [
    {
        title: 'Synthèse',
        content: [
            { title: 'Fonctions actuelles', component: 'functions' },
            { title: 'Contact', component: 'contact' },
            { title: 'Les dernières dépêches', component: 'news' },
        ],
        component: 'synthesis',
        print: true,
    },
    {
        title: 'Fonctions et responsabilités',
        content: [],
        component: 'responsability',
        print: true,
    },
    {
        title: 'Présence sur le web',
        content: [],
        component: 'web',
        print: false,
    },
    {
        title: 'Prix et distinctions',
        content: [],
        component: 'price',
        print: true,
    },
    {
        title: 'Identifiants',
        content: [],
        component: 'identifier',
        print: true,
    },
];

export const StructurePageSkeleton = [
    {
        title: 'Présentation',
        component: 'presentation',
        content: [
            { title: '', component: 'header' },
            { title: 'Historique et dates', component: 'history' },
            { title: 'Composition', component: 'composition' },
            { title: 'Structures internes', component: 'internals' },
            { title: 'Catégories', component: 'categories' },
            { title: 'Participations', component: 'participations' },
            { title: 'Palmarès et classements', component: 'rank' },
            { title: 'Présence sur le web', component: 'web' },
        ],
        print: true,
    },
    {
        title: 'Gouvernance et référents',
        component: 'governance',
        content: [],
        print: true,
    },
    {
        title: 'Chiffres-clés',
        component: 'keyNumbers',
        content: [],
        print: true,
    },
    {
        title: 'Ressources humaines',
        component: 'hr',
        content: [],
        print: true,
    },
    {
        title: 'Budget',
        component: 'budget',
        content: [],
        print: true,
    },
    {
        title: 'Analyse',
        component: 'analyse',
        content: [],
        print: true,
    },
    {
        title: 'Suivi DGESIP-Établissement',
        component: 'followUp',
        content: [],
        print: true,
    },
    {
        title: 'Actualité',
        component: 'news',
        content: [],
        print: true,
    },
    {
        title: 'Immobilier',
        component: 'estate',
        content: [],
        print: true,
    },
    {
        title: 'Étudiants',
        component: 'students',
        content: [],
        print: false,
    },
    {
        title: 'Thèmes',
        component: 'thema',
        content: [],
        print: false,
    },
    {
        title: 'Projets',
        component: 'project',
        content: [],
        print: true,
    },
];

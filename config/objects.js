import PropTypes from 'prop-types';
import { configValidator as configValidatorCategoryIdentifiers } from '../components/ContribCategory/configValidatorIdentifiers';

import { configValidator as configValidatorCategoryWeblinks } from '../components/ContribCategory/configValidatorWeblinks';
import { configValidator as configValidatorOfficialDocumentId } from '../components/ContribOfficialDocument/configValidatorofficialDocumentId';
import { configValidator as configValidatorPersonIdentifiers } from '../components/ContribPerson/configValidatorIdentifiers';
import { configValidator as configValidatorPersonNames } from '../components/ContribPerson/configValidatorNames';
import { configValidator as configValidatorPersonSocialmedias } from '../components/ContribPerson/configValidatorSocialmedias';
import { configValidator as configValidatorStructureIdentifiers } from '../components/ContribStructure/configValidatorIdentifiers';

import { configValidator as configValidatorStructureLocalisations } from '../components/ContribStructure/configValidatorLocalisations';

import { configValidator as configValidatorStructureNames } from '../components/ContribStructure/configValidatorNames';
import { configValidator as configValidatorStructureRankings } from '../components/ContribStructure/configValidatorRankings';
import { configValidator as configValidatorStructureSocialmedias } from '../components/ContribStructure/configValidatorSocialmedias';

import { configValidator as configValidatorStructureWeblinks } from '../components/ContribStructure/configValidatorWeblinks';

const structureSubObjects = [
    { subObject: 'names', initBody: { usualName: '' } },
    { subObject: 'localisations', initBody: { country: '' } },
    { subObject: 'rankings', initBody: { url: '' } },
    {
        subObject: 'weblinks',
        initBody: {
            type: '',
            url: '',
        },
    },
    {
        subObject: 'socialmedias',
        initBody: {
            type: '',
            account: '',
        },
    },
    {
        subObject: 'identifiers',
        initBody: {
            type: '',
            value: '',
            active: false,
        },
    },
];

const personSubObjects = [
    { subObject: 'names', initBody: { usualName: '' } },
    {
        subObject: 'identifiers',
        initBody: {
            type: '',
            value: '',
            active: false,
        },
    },
];

const officialDocumentSubObjects = [
    {
        subObject: 'officialDocumentId',
        initBody: {
            type: '',
        },
    },
];

const categorySubObjects = [
    {
        subObject: 'identifiers',
        initBody: {
            type: '',
            value: '',
            active: false,
        },
    },
    {
        subObject: 'weblinks',
        initBody: {
            type: '',
            url: '',
        },
    },
];

export const subObjects = {
    person: personSubObjects,
    structure: structureSubObjects,
    category: categorySubObjects,
    officialDocument: officialDocumentSubObjects,
};

export const configValidators = {
    structure: {
        identifiers: configValidatorStructureIdentifiers,
        names: configValidatorStructureNames,
        localisations: configValidatorStructureLocalisations,
        weblinks: configValidatorStructureWeblinks,
        socialmedias: configValidatorStructureSocialmedias,
        rankings: configValidatorStructureRankings,
    },
    person: {
        identifiers: configValidatorPersonIdentifiers,
        names: configValidatorPersonNames,
        socialmedias: configValidatorPersonSocialmedias,
    },
    category: {
        identifiers: configValidatorCategoryIdentifiers,
        weblinks: configValidatorCategoryWeblinks,
    },
    officialDocument: {
        officialDocumentId: configValidatorOfficialDocumentId,
    },
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

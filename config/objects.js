import PropTypes from 'prop-types';
import { configValidator as configValidatorCategoryIdentifiers } from '../components/ContribCategory/configValidatorIdentifiers';

import { configValidator as configValidatorCategoryWeblinks } from '../components/ContribCategory/configValidatorWeblinks';
import { configValidator as configValidatorDocumentInfos } from '../components/ContribDocument/configValidatorInfos';
import { configValidator as configValidatorLegalCategory } from '../components/ContribLegalCategory/configValidator';
import { configValidator as configValidatorOfficialDocument } from '../components/ContribOfficialDocument/configValidator';
import { configValidator as configValidatorPerson } from '../components/ContribPerson/configValidator';
import { configValidator as configValidatorPersonIdentifiers } from '../components/ContribPerson/configValidatorIdentifiers';
import { configValidator as configValidatorPersonWebLinks } from '../components/ContribPerson/configValidatorPersonWebLinks';
import { configValidator as configValidatorPersonSocialmedias } from '../components/ContribPerson/configValidatorSocialmedias';

import { configValidator as configValidatorPriceNames } from '../components/ContribPrice/configValidatorNames';

import { configValidator as configValidatorStructure } from '../components/ContribStructure/configValidator';
import { configValidator as configValidatorStructureCategories } from '../components/ContribStructure/configValidatorCategories';
import { configValidator as configValidatorStructureIdentifiers } from '../components/ContribStructure/configValidatorIdentifiers';
import { configValidator as configValidatorStructureLinks } from '../components/ContribStructure/configValidatorLinks';
import { configValidator as configValidatorStructureLocalisations } from '../components/ContribStructure/configValidatorLocalisations';
import { configValidator as configValidatorStructureNames } from '../components/ContribStructure/configValidatorNames';
import { configValidator as configValidatorStructureSocialmedias } from '../components/ContribStructure/configValidatorSocialmedias';
import { configValidator as configValidatorStructureWeblinks } from '../components/ContribStructure/configValidatorWeblinks';

import { configValidator as configValidatorTermNames } from '../components/ContribTerm/configValidatorNames';

const structureSubObjects = [
    { subObject: 'names', initBody: { usualName: '' } },
    { subObject: 'localisations', initBody: { country: '' } },
    {
        subObject: 'weblinks',
        initBody: {
            type: '',
            url: '',
        },
    },
    {
        subObject: 'socials',
        initBody: {
            type: '',
            account: '',
        },
    },
    {
        subObject: 'categories',
        initBody: {
            categoryId: '',
        },
    },
    {
        subObject: 'identifiers',
        initBody: {
            type: 'Wikidata',
            value: '',
            active: false,
        },
    },
];

const personSubObjects = [
    {
        subObject: 'weblinks',
        initBody: {
            type: '',
            url: '',
        },
    },
    {
        subObject: 'socials',
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

const legalCategorySubObjects = [];

const officialDocumentSubObjects = [];

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

const priceSubObjects = [
    {
        subObject: 'names',
        initBody: { nameFr: '' },
    },
];

const termSubObjects = [
    {
        subObject: 'names',
        initBody: { usualNameFr: '' },
    },
];

const documentSubObjects = [
    {
        subObject: 'infos',
        initBody: { usualNameFr: '' },
    },
];

export const subObjects = {
    person: personSubObjects,
    structure: structureSubObjects,
    category: categorySubObjects,
    officialDocument: officialDocumentSubObjects,
    price: priceSubObjects,
    term: termSubObjects,
    legalCategory: legalCategorySubObjects,
    documents: documentSubObjects,
};

export const configValidators = {
    structure: {
        identifiers: configValidatorStructureIdentifiers,
        categories: configValidatorStructureCategories,
        names: configValidatorStructureNames,
        links: configValidatorStructureLinks,
        localisations: configValidatorStructureLocalisations,
        weblinks: configValidatorStructureWeblinks,
        socials: configValidatorStructureSocialmedias,
        general: configValidatorStructure,
    },
    person: {
        identifiers: configValidatorPersonIdentifiers,
        weblinks: configValidatorPersonWebLinks,
        socials: configValidatorPersonSocialmedias,
        general: configValidatorPerson,
    },
    category: {
        identifiers: configValidatorCategoryIdentifiers,
        weblinks: configValidatorCategoryWeblinks,
    },
    officialDocument: {
        general: configValidatorOfficialDocument,
    },
    price: {
        names: configValidatorPriceNames,
    },
    term: {
        names: configValidatorTermNames,
    },
    document: {
        infos: configValidatorDocumentInfos,
    },
    legalCategory: {
        general: configValidatorLegalCategory,
    },
};

// TODO refacto skeletons objects => {Person: Skeleton,...}
export const PersonPageSkeletonPropType = PropTypes.shape({
    web: PropTypes.func.isRequired,
    responsability: PropTypes.func.isRequired,
    identifier: PropTypes.func.isRequired,
    price: PropTypes.func.isRequired,
    synthesis: PropTypes.func.isRequired,
});

export const PersonPageSkeleton = [
    {
        title: 'Synth??se',
        content: [
            { title: 'Fonctions actuelles', component: 'functions' },
            { title: 'Contact', component: 'contact' },
            { title: 'Les derni??res d??p??ches', component: 'news' },
        ],
        component: 'synthesis',
        print: true,
    },
    {
        title: 'Fonctions et responsabilit??s',
        content: [],
        component: 'responsability',
        print: true,
    },
    {
        title: 'Pr??sence sur le web',
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

export const PricePageSkeleton = [
    {
        title: 'Pr??sentation',
        component: 'presentation',
        content: [{ title: 'Fonctions actuelles', component: 'functions' }],
        print: false,
    },
];
export const CategoryPageSkeleton = [
    {
        title: 'Pr??sentation',
        component: 'presentation',
        content: [{ title: 'Test', component: 'test' }],
        print: false,
    },
];

export const LegalCategoryPageSkeleton = [
    {
        title: 'Informations',
        component: 'presentation',
        content: [{ title: 'Test', component: 'test' }],
        print: false,
    },
];

export const TermPageSkeleton = [
    {
        title: 'Pr??sentation',
        component: 'presentation',
        content: [{ title: 'Test', component: 'test' }],
        print: false,
    },
];

export const DocumentPageSkeleton = [
    {
        title: 'Informations',
        component: 'presentation',
        content: [{ title: 'Test', component: 'test' }],
        print: false,
    },
];

export const StructurePageSkeleton = [
    {
        title: 'Pr??sentation',
        component: 'presentation',
        content: [
            { title: 'G??n??ral', component: 'header' },
            { title: 'Historique et dates', component: 'history' },
            { title: 'Identifiants', component: 'identifiersWrapper' },
            { title: 'Liens web', component: 'web' },
            { title: 'R??seaux sociaux', component: 'socials' },
            { title: 'Textes officiels', component: 'officialTexts' },
            { title: 'Documents', component: 'documents' },

            // { title: 'Composition', component: 'composition' },
            // { title: 'Structures internes', component: 'internals' },
            // { title: 'Cat??gories', component: 'categories' },
            // { title: 'Participations', component: 'participations' },
            // { title: 'Palmar??s et classements', component: 'rank' },
            // { title: 'Pr??sence sur le web', component: 'web' },
        ],
        print: true,
    },
    // {
    //     title: 'Gouvernance et r??f??rents',
    //     component: 'governance',
    //     content: [],
    //     print: true,
    // },
    // {
    //     title: 'Chiffres-cl??s',
    //     component: 'keyNumbers',
    //     content: [],
    //     print: true,
    // },
    // {
    //     title: 'Ressources humaines',
    //     component: 'hr',
    //     content: [],
    //     print: true,
    // },
    // {
    //     title: 'Budget',
    //     component: 'budget',
    //     content: [],
    //     print: true,
    // },
    // {
    //     title: 'Analyse',
    //     component: 'analyse',
    //     content: [],
    //     print: true,
    // },
    // {
    //     title: 'Suivi DGESIP-??tablissement',
    //     component: 'followUp',
    //     content: [],
    //     print: true,
    // },
    // {
    //     title: 'Actualit??',
    //     component: 'news',
    //     content: [],
    //     print: true,
    // },
    // {
    //     title: 'Immobilier',
    //     component: 'estate',
    //     content: [],
    //     print: true,
    // },
    // {
    //     title: '??tudiants',
    //     component: 'students',
    //     content: [],
    //     print: false,
    // },
    // {
    //     title: 'Th??mes',
    //     component: 'thema',
    //     content: [],
    //     print: false,
    // },
    // {
    //     title: 'Projets',
    //     component: 'project',
    //     content: [],
    //     print: true,
    // },
];

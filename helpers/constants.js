import { cleanString } from './utils';

export function getUrl(key) {
    const urls = {
        genre: 'https://jsonplaceholder.typicode.com/todos',
        etat: 'https://jsonplaceholder.typicode.com/todos',
        tutelle: 'https://jsonplaceholder.typicode.com/todos',
    };

    return urls[cleanString(key)];
}

export function getVal(key) {
    const data = {
        IDB_DATABASE_NAME: 'SERVICE_FORMS',
        IDB_DATABASE_VERSION: 1,
    };

    return data[key];
}

export function getTitle(key) {
    const data = {
        5: 'Universités',
    };

    return data[key];
}

/**
 *
 * @param id
 * @returns string
 */
export function getObjectType(id) {
    const objectTypes = {
        0: {
            name: 'structure',
            title: 'Établissement',
            color: '--green-tilleul-verveine-main-707',
        },
        1: {
            name: 'person',
            title: 'Personne',
            color: '--pink-tuile-main-556',
        },
        2: { name: 'project', title: 'Projet' },
        3: { name: 'category', title: 'Catégorie' },
    };

    return objectTypes[id];
}

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

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
            color: '--yellow-dark-700',
        },
        1: { name: 'person', title: 'Personne', color: '--pink-soft-700' },
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
            { title: 'Les dernières dépêches' },
        ],
        component: 'synthesis',
    },
    {
        title: 'Fonctions et responsabilités',
        content: [],
        component: 'responsability',
    },
    {
        title: 'Présence sur le web',
        content: [],
        component: 'web',
    },
    {
        title: 'Prix et distinctions',
        content: [],
        component: 'price',
    },
    {
        title: 'Identifiants',
        content: [],
        component: 'identifier',
    },
];

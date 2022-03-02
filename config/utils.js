import { cleanString } from '../helpers/utils';

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
        IDB_DATABASE_VERSION: 3,
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
            colorClassName: 'Yellow',
        },
        1: {
            name: 'person',
            title: 'Personne',
            color: '--pink-tuile-main-556',
            colorClassName: 'Pink',
        },
        2: { name: 'project', title: 'Projet' },
        3: { name: 'category', title: 'Catégorie' },
    };

    return objectTypes[id];
}

export const mapFields = (form) => {
    // TODO handle nested object
    const obj = {
        'update/structure': [
            'address',
            'value',
            'type',
            'active',
            'postalCode',
            'country',
            'locality',
            'telephone',
            'officialName',
            'usualName',
            'startDate',
            'endDate',
            'article',
            'shortName',
            'brandName',
            'nameEn',
            'acronymFr',
            'acronymEn',
            'firstName',
            'lastName',
            'acronymLocal',
            'otherNames',
            'comment',
        ],
    };

    return obj[form];
};

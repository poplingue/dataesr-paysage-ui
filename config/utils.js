import { cleanString } from '../helpers/utils';

export function getUrl(key) {
    const urls = {
        genre: 'https://jsonplaceholder.typicode.com/todos',
        etat: 'https://jsonplaceholder.typicode.com/todos',
        tutelle: 'https://jsonplaceholder.typicode.com/todos',
        address: 'https://api-adresse.data.gouv.fr/search?limit=10',
        locality:
            'https://public.opendatasoft.com/api/v2/catalog/datasets/georef-france-commune/records?rows=10&select=*&pretty=false&timezone=UTC',
    };

    return urls[cleanString(key)];
}

export function getVal(key) {
    const data = {
        IDB_DATABASE_NAME: 'SERVICE_FORMS',
        IDB_DATABASE_VERSION: 6,
    };

    return data[key];
}

/**
 *
 * @param id
 * @param name
 * @returns {*}
 */
export function getObjectTypeDetails(id, name) {
    // TODO handle color for each object
    const objectTypes = {
        0: {
            name: 'structure',
            title: 'Structure',
            text: 'la structure',
            color: '--green-tilleul-verveine-main-707',
            colorClassName: 'Yellow',
            dataesrApi: 'structures',
        },
        1: {
            name: 'person',
            title: 'Personne',
            color: '--pink-tuile-main-556',
            colorClassName: 'Pink',
            dataesrApi: 'persons',
        },
        2: { name: 'project', title: 'Projet' },
        3: {
            name: 'category',
            color: '--green-bourgeon-main-640',
            title: 'Catégorie',
            dataesrApi: 'categories',
        },
        4: {
            name: 'officialDocument',
            color: '--green-archipel-main-557',
            title: 'Document Officiel',
            dataesrApi: 'official-documents',
        },
    };

    if (name) {
        id = Object.keys(objectTypes).find(
            (id) => objectTypes[id].name === name
        );
    }

    return objectTypes[id];
}

/**
 *
 * @param form
 * @returns {*}
 */
export const mapFields = (form) => {
    // TODO handle nested object like geometry
    const obj = {
        'contrib/person': [],
        'contrib/officialDocument': [],
        'contrib/category': ['type', 'url', 'comment'],
        'contrib/structure': [
            'address',
            'geometry.latitude',
            'geometry.longitude',
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

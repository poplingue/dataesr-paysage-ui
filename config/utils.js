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
        IDB_DATABASE_VERSION: 1,
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
    // TODO refacto param => {}
    const objectTypes = {
        0: {
            name: 'structure',
            title: 'Structure',
            text: 'la structure',
            color: '--yellow-tournesol-main-731',
            colorClassName: 'Yellow',
            dataesrApi: 'structures',
        },
        1: {
            name: 'person',
            title: 'Personne',
            text: 'la personne',
            color: '--pink-tuile-main-556',
            colorClassName: 'Pink',
            dataesrApi: 'persons',
        },
        2: {
            name: 'category',
            color: '--green-bourgeon-main-640',
            text: 'la catégorie',
            title: 'Catégorie',
            colorClassName: 'Green',
            dataesrApi: 'categories',
        },
        3: {
            name: 'officialDocument',
            color: '--green-archipel-main-557',
            text: 'le document officiel',
            title: 'Document Officiel',
            dataesrApi: 'official-documents',
        },
        4: {
            name: 'legalCategory',
            color: '--brown-caramel-main-648',
            text: 'la catégorie légale',
            title: 'Catégorie Légale',
            colorClassName: 'Brown',
            dataesrApi: 'legal-categories',
        },
        5: {
            name: 'price',
            text: 'le prix',
            color: '--blue-ecume-main-400',
            title: 'Prix',
            colorClassName: 'Blue',
            dataesrApi: 'prices',
        },
        6: {
            name: 'term',
            text: 'le terme',
            color: '--purple-glycine-main-494',
            title: 'Terme',
            colorClassName: 'Purple',
            dataesrApi: 'terms',
        },
        7: {
            name: 'document',
            text: 'le document',
            color: '--green-archipel-main-557',
            title: 'Documents',
            colorClassName: 'Archipel',
            dataesrApi: 'documents',
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
        'contrib/document': [],
        'contrib/price': [],
        'contrib/officialDocument': [],
        'contrib/category': ['type', 'url', 'comment'],
        'contrib/structure': [
            'address',
            'geometry.latitude',
            'geometry.longitude',
            'value',
            'url',
            'language',
            'account',
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

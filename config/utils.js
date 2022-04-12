import { cleanString } from '../helpers/utils';

export function getUrl(key) {
    const urls = {
        genre: 'https://jsonplaceholder.typicode.com/todos',
        etat: 'https://jsonplaceholder.typicode.com/todos',
        tutelle: 'https://jsonplaceholder.typicode.com/todos',
        address: 'https://api-adresse.data.gouv.fr/search?limit=10',
        cityID: 'https://public.opendatasoft.com/api/v2/catalog/datasets/correspondance-code-insee-code-postal//records?rows=10&select=*&pretty=false&timezone=UTC',
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
    // TODO refacto param => {}
    const objectTypes = {
        0: {
            name: 'structure',
            title: 'Structure',
            text: 'la structure',
            color: '--yellow-tournesol-main-731',
            colorClassName: 'Yellow',
            dataesrApi: 'structures',
            tableSchema: [
                {
                    title: 'Nom officiel',
                    field: 'officialName',
                    editor: 'input',
                    headerFilter: 'input',
                },
                {
                    title: 'Nom usuel',
                    field: 'usualName',
                    editor: 'input',
                    headerFilter: 'input',
                },
            ],
        },
        1: {
            name: 'person',
            title: 'Personne',
            text: 'la personne',
            color: '--pink-tuile-main-556',
            colorClassName: 'Pink',
            dataesrApi: 'persons',
            tableSchema: [],
        },
        2: {
            name: 'category',
            color: '--green-emeraude-main-632',
            text: 'la catégorie',
            title: 'Catégorie',
            colorClassName: 'Green',
            dataesrApi: 'categories',
            tableSchema: [],
        },
        3: {
            name: 'officialDocument',
            color: '--blue-cumulus-main-526',
            text: 'le document officiel',
            title: 'Document Officiel',
            dataesrApi: 'officialdocuments',
            tableSchema: [],
        },
        4: {
            name: 'legalCategory',
            color: '--brown-caramel-main-648',
            text: 'la catégorie légale',
            title: 'Catégorie Légale',
            colorClassName: 'Brown',
            dataesrApi: 'legalcategories',
            tableSchema: [],
        },
        5: {
            name: 'price',
            text: 'le prix',
            color: '--blue-ecume-main-400',
            title: 'Prix',
            colorClassName: 'Blue',
            dataesrApi: 'prices',
            tableSchema: [],
        },
        6: {
            name: 'term',
            text: 'le terme',
            color: '--purple-glycine-main-494',
            title: 'Terme',
            colorClassName: 'Purple',
            dataesrApi: 'terms',
            tableSchema: [],
        },
        7: {
            name: 'document',
            text: 'le document',
            color: '--green-archipel-main-557',
            title: 'Documents',
            colorClassName: 'Archipel',
            dataesrApi: 'documents',
            tableSchema: [],
        },
    };

    if (name) {
        id = Object.keys(objectTypes).find(
            (id) => objectTypes[id].name === name
        );
    }

    return objectTypes[id] || {};
}

/**
 *
 * @param form
 * @returns {*}
 */
export const mapFields = (form) => {
    const obj = {
        'contrib/person': [
            'firstName',
            'lastName',
            'type',
            'value',
            'active',
            'account',
            'otherNames',
            'birthDate',
            'deathDate',
            'comment',
        ],
        'contrib/document': [],
        'contrib/legalCategory': [],
        'contrib/price': [],
        'contrib/officialDocument': [],
        'contrib/category': ['type', 'url', 'comment'],
        'contrib/structure': [
            'address',
            'creationDate',
            'descriptionFr',
            'descriptionEn',
            'creationOfficialDocumentId',
            'coordinates.lat',
            'coordinates.lng',
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

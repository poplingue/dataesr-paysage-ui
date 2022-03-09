import { cleanString } from '../helpers/utils';

export function getUrl(key) {
    const urls = {
        genre: 'https://jsonplaceholder.typicode.com/todos',
        etat: 'https://jsonplaceholder.typicode.com/todos',
        tutelle: 'https://jsonplaceholder.typicode.com/todos',
        locality:
            'https://public.opendatasoft.com/api/records/1.0/search/?dataset=georef-france-commune&facet=arrdep_name&facet=ze2020_name&facet=com_name',
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
 * @param name
 * @returns {*}
 */
export function getObjectTypeDetails(id, name) {
    const objectTypes = {
        0: {
            name: 'structure',
            title: 'Établissement',
            text: 'la structure',
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
        'update/structure': [
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

import { cleanString } from './utils';

export function getUrl(key) {
    const urls = {
        'genre': 'https://jsonplaceholder.typicode.com/todos',
        'etat': 'https://jsonplaceholder.typicode.com/todos'
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
        university: 'Universités',
    };

    return data[key];
}

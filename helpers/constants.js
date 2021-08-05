import { cleanString } from './utils';

export function getUrl(key) {
    const urls = {
        'genre': 'https://fakestoreapi.com/products/2',
        'etat': 'https://fakestoreapi.com/products/1'
    };
    return urls[cleanString(key)];
}

export function getVal(key) {
    const data = {
        IDB_DATABASE_NAME: 'SERVICE_FORMS',
        IDB_DATABASE_VERSION: 2,
    };
    return data[key];
}
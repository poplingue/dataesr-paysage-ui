import cleanString from './utils';

function getUrl(key) {
    const urls = {
        'genre': 'https://fakestoreapi.com/products/2',
        'etat': 'https://fakestoreapi.com/products/1'
    };
    return urls[cleanString(key)];
}

export default getUrl;
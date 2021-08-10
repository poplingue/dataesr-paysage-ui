/**
 *
 * @param str
 * @returns {string}
 */
export function cleanString(str) {
    return str.replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

/**
 *
 * @param obj
 * @param array
 * @returns {boolean}
 */
export function containsObject(obj, array) {
    let i;
    for (i = 0; i < array.length; i++) {
        if (array[i] === obj) {
            return true;
        }
    }
    return false;
}

/**
 *
 * @param pathname
 * @param name
 * @param key
 * @returns {string}
 */
export function getUniqueId(pathname, name, key) {
    let r = `${pathname.substring(1)}-${cleanString(name)}-${key}`;
    if (!key && key !== 0) {
        r = `${pathname.substring(1)}-${cleanString(name)}`;
    }
    return r;
}

/**
 *
 * @param pathname
 * @returns {string}
 */
export function getFormName(pathname) {
    return pathname.substring(1);
}
/**
 *
 * @param str
 * @returns {string}
 */

export function cleanString(str) {
    if (!str) {
        return '';
    }

    return str
        .replace(/\s+/g, '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
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
 * @param formName
 * @param name
 * @param id
 * @param section
 * @returns {string} format pathname@[section#i]/[name]#[index]
 */
export function getUniqueId(formName, section = '', name = '', id) {
    // TODO standardize this shit
    let r = `${formName}@${cleanString(section)}/${cleanString(name)}#${id}`;

    if (!id && id !== 0) {
        r = `${formName}@${cleanString(section)}/${cleanString(name)}`;
    }

    if (!name) {
        r = `${formName}@${cleanString(section)}`;
    }

    return r;
}

/**
 *
 * @returns {string}
 */
export function getFormName(pathname, query) {
    return pathname.replace(/\[+([^\][]+)]+/g, query).substring(1);
}

/**
 *
 * @param obj
 * @param keyToDelete
 * @returns {Pick<*, Exclude<keyof *, never>>}
 */
export function removeKey(obj, keyToDelete) {
    const { [keyToDelete]: deleted, ...objectWithoutDeletedKey } = obj;

    return objectWithoutDeletedKey;
}

/**
 *
 * @param min
 * @param max
 * @param string
 * @returns {unknown[]}
 */
export function range(min, max, string) {
    return Array(max - min + 1)
        .fill(0)
        .map((_, i) => (string ? (i + min).toString() : i + min));
}

/**
 *
 * @param value
 * @param index
 * @param self
 * @returns {boolean}
 */
export function uniqueOnlyFilter(value, index, self) {
    return self.indexOf(value) === index;
}

/**
 *
 * @param title
 * @param contentNumber
 * @returns {string}
 */
export function sectionUniqueId(title, contentNumber = '0') {
    return `${cleanString(title)}-${contentNumber}`;
}

/**
 *
 * @param forms
 * @param name
 * @returns {null || array}
 */
export function getForm(forms, name) {
    let form = null;

    if (name) {
        for (let i = 0; i < forms.length; i = i + 1) {
            if (Object.keys(forms[i])[0] === name) {
                form = forms[i][name];
            }
        }
    }

    return form;
}

/**
 *
 * @param forms
 * @param name
 * @param id
 * @returns {string}
 */
export function getFieldValue(forms, name, id) {
    let fieldValue = '';

    if (getForm(forms, name) && id) {
        fieldValue = getForm(forms, name).find((field) => {
            return field.uid === id;
        });
    }

    return fieldValue ? fieldValue.value : '';
}

/**
 *
 * @param property
 * @returns {string}
 */
export function getCSSValue(property) {
    return getComputedStyle(document.documentElement).getPropertyValue(
        property
    );
}

/**
 *
 * @param property
 * @param value
 */
export function setCSSProperty(property, value) {
    document.documentElement.style.setProperty(property, value);
}

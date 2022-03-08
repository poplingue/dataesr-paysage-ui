/**
 *
 * @param dirtyDate
 * @returns {string}
 */
export function niceDate(dirtyDate) {
    let niceDate = '';

    if (dirtyDate) {
        const date = new Date(dirtyDate);
        niceDate = new Intl.DateTimeFormat('fr-FR').format(date);
    }

    return niceDate;
}

/**
 *
 * @param date
 * @returns {{hasMonth: boolean, hasDay: boolean, onlyYear: boolean, splitDate: *}}
 */
export function checkDate(date) {
    const splitDate = date.split('-');

    const hasDay = splitDate.length === 3;
    const hasMonth = splitDate.length >= 2;
    const onlyYear = splitDate.length === 1;

    return { hasDay, hasMonth, onlyYear, splitDate };
}

/**
 *
 * @param dirtyDate
 * @returns {string}
 */
export function niceFullDate(dirtyDate) {
    let niceDate = '';

    if (dirtyDate) {
        const date = new Date(dirtyDate);
        const { hasDay, hasMonth } = checkDate(dirtyDate);

        const options = {
            day: hasDay ? 'numeric' : undefined,
            month: hasMonth ? 'long' : undefined,
            year: 'numeric',
        };
        niceDate = new Intl.DateTimeFormat('fr-FR', options).format(date);
    }

    return niceDate;
}

/**
 *
 * @param str
 * @returns {*}
 */
export function getSubObjectType(str) {
    return str.slice(0, -9);
}

/**
 *
 * @param section
 * @returns {*|string}
 */
export function getSubObjectId(section) {
    return matchRegex(`[^#]*$`, section);
}

/**
 *
 * @param str
 * @returns {*}
 */
export function lastChar(str) {
    return str.slice(-1);
}

/**
 *
 * @param str
 * @returns {*}
 */
export function camelCase(str) {
    return str
        .replace(/\s(.)/g, function (a) {
            return a.toUpperCase();
        })
        .replace(/\s/g, '')
        .replace(/^(.)/, function (b) {
            return b.toLowerCase();
        });
}

/**
 *
 * @param str
 * @returns {string}
 */

export function cleanString(str) {
    // TODO replace ??=
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
 * @param nameId
 * @param eq
 * @param section
 * @returns {string} format pathname@[section#id]_[nameId]#[eq]
 */
export function getUniqueId(formName, section = '', nameId = '', eq = null) {
    const checkedEq = eq !== null && eq >= 0 ? `#${eq}` : '';
    let uniqueId = `${formName}@${section}_${nameId}${checkedEq}`;

    if (!nameId && nameId !== 0) {
        uniqueId = `${formName}@${section}_${nameId}`;
    }

    if (!nameId) {
        uniqueId = `${formName}@${section}`;
    }

    return uniqueId;
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
        .map((_, i) =>
            string ? (i + min).toString().padStart(2, '0') : i + min
        );
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
export function sectionUniqueId(title, contentNumber = '0', separator = '-') {
    return `${cleanString(title)}${separator}${contentNumber}`;
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
 * @param uid
 * @returns {RegExpExecArray}
 */
export function getSection(uid) {
    const match = /(?<=\@).+?(?=\_)/.exec(uid);

    return match && match[0];
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
 * @param forms
 * @param name
 * @param id
 * @returns {{}}
 */
export function getField(forms, name, id) {
    let field = {};

    if (getForm(forms, name) && id) {
        field = getForm(forms, name).find((field) => {
            return field.uid === id;
        });
    }

    return field;
}

/**
 *
 * @param forms
 * @param name
 * @param id
 * @returns {*}
 */
export function isFieldUnSaved(forms, name, id) {
    let fieldUnSaved = { unSaved: false };

    if (getForm(forms, name) && id) {
        fieldUnSaved = getForm(forms, name).find((field) => {
            return field.uid === id;
        });
    }

    return fieldUnSaved && fieldUnSaved.unSaved;
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

/**
 *
 * @param e
 * @param dataSection
 */
export const goToSection = (e, dataSection) => {
    const section = document.querySelector(`[data-section=${dataSection}]`);

    if (section) {
        const { left, top } = section.getBoundingClientRect();
        window.scrollTo(left, top + window.scrollY);
    }
};

/**
 *
 * @param pageId
 * @returns {Node}
 */
export function cleanedPrintPage(pageId) {
    const page = document.getElementById(pageId);
    const clonePage = page.cloneNode('deep');

    const elements = clonePage.getElementsByClassName(noPrintClass);

    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }

    return clonePage;
}

/**
 *
 * @param value
 */
export function isArray(value) {
    if (typeof value === 'boolean') {
        return false;
    }

    return value && value.indexOf('') < 0;
}

export const idToPrint = 'page-to-print';
export const noPrintClass = 'no-print';

export const cookieOptions = {
    maxAge: 60 * 60,
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
};

/**
 *
 * @param pattern
 * @param str
 * @returns {*|string}
 */
export function matchRegex(pattern, str) {
    const regex = new RegExp(pattern, 'g');
    const matchField = str.match(regex);

    const obj = {
        true: (matchField) => matchField[0],
        false: () => '',
    };

    return obj[!!matchField](matchField);
}

/**
 *
 * @type {{true: (function(): *[]), false: (function(*): *)}}
 */
export const checkFlatMap = {
    false: () => [],
    true: (value) => value,
};

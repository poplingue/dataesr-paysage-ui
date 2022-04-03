import { subObjects } from '../config/objects';
import { mapFields } from '../config/utils';
import { fetchHelper } from '../helpers/fetch';
import { genericErrorMsg } from '../helpers/internalMessages';
import {
    checkDate,
    checkFlatMap,
    getSubObjectId,
    getSubObjectType,
    getUniqueId,
    isArray,
    isFieldUnSaved,
    matchRegex,
} from '../helpers/utils';
import DBService from './DB.service';

const fieldMapping = {
    endDate: (uid, value) => dataFormService.mapDate(uid, value),
    startDate: (uid, value) => dataFormService.mapDate(uid, value),
    creationDate: (uid, value) => dataFormService.mapDate(uid, value),
};

const fields = {
    true: (...params) => dataFormService.infiniteField(params),
    false: (...params) => dataFormService.uniqueField(params),
};

const objectValue = {
    true: (field, value) => {
        return { [field]: [value] };
    },
    false: (field) => {
        return { [field]: [] };
    },
};

export const dataFormService = {
    mapDate: (uid, value) => {
        let mapping = [];
        const { hasDay, hasMonth, onlyYear, splitDate } = checkDate(value);

        const formatValue = (date) => {
            // case yyyy-mm-dd
            let value = date;

            // case yyyy-mm
            if (hasMonth && !hasDay) {
                value = `${value}-dd`;
            }

            // case yyyy
            if (onlyYear) {
                value = `${value}-mm-dd`;
            }

            return value;
        };

        const fieldId = {
            0: 'Year',
            1: 'Month',
            2: 'Day',
        };

        // full date yyyy-mm-dd
        mapping.push({ uid, value: formatValue(value) });

        // Each date values yyyy, mm, dd
        for (let i = 0; i < splitDate.length; i = i + 1) {
            mapping.push({
                uid: `${uid}${fieldId[i]}`,
                value: splitDate[i],
                unSaved: false,
            });
        }

        return mapping;
    },

    cleanDateFormat: (field) => {
        const subObjectType = matchRegex(`([^\_]+)$`, field.uid);
        const needClean =
            ['endDate', 'startDate', 'creationDate'].indexOf(subObjectType) >
            -1;

        if (needClean) {
            // remove empty date values in date format yyyy-mm-dd
            const value = field.value.replace(/(\-[a-z]).{1}|,/g, '');

            return { ...field, value };
        }

        return field;
    },

    checkDateField: (field) => !matchRegex(`Day|Year|Month$`, field.uid),

    bySubObject: (field, subObject) => {
        return field.uid.indexOf(subObject) > -1;
    },

    byInfiniteFamily: (field, index, form) => {
        // TODO refacto: work only with 1 infinite field in section
        const checkFamily = form.find((f) => f.infinite && f.unSaved);

        const obj = {
            false: () => '',
            true: (o) => o.uid,
        };

        const id = obj[!!checkFamily](checkFamily).slice(0, -2);

        const family = checkFamily ? id : '';
        const isUnsaved = field.unSaved;

        if (isUnsaved) {
            return true;
        }

        if (family && checkFamily) {
            if (field.uid.startsWith(id)) {
                return true;
            }
        }

        return false;
    },

    deleteField: async (object, objectId, subObject, key, values) => {
        const subObjectType = getSubObjectType(subObject);
        const subObjectId = getSubObjectId(subObject);

        const url = `/api/${object}/${objectId}/${subObjectType}/${subObjectId}`;
        const requestOptions = fetchHelper.requestOptions('PATCH', {
            [key]: values,
        });

        return await fetch(url, requestOptions);
    },

    /**
     *
     * @param object
     * @param objectId
     * @param subObjectType
     * @param subObjectId
     * @returns {Promise<Response>}
     */
    deleteSubObject: async (object, objectId, subObjectType, subObjectId) => {
        const url = `/api/${object}/${objectId}/${subObjectType}/${subObjectId}`;
        const requestOptions = fetchHelper.requestOptions('DELETE');

        return await fetch(url, requestOptions);
    },

    uniqueField: (params) => {
        const [value, subObject, sectionId, field, formName] = params;
        const section = sectionId ? `${subObject}#${sectionId}` : subObject;

        const uid = getUniqueId(formName, section, field);

        const needMapping = Object.keys(fieldMapping).indexOf(field) > -1;

        const objField = {
            false: (uid, value) => {
                return [{ uid, value }];
            },
            true: (uid, value) => fieldMapping[field](uid, value),
        };

        return objField[needMapping](uid, value);
    },

    infiniteField: (params) => {
        const [values, subObject, sectionId, field, formName] = params;
        const section = sectionId ? `${subObject}#${sectionId}` : subObject;

        return values.map((value, vIndex) => {
            const uid = getUniqueId(formName, section, field, vIndex);

            return {
                uid,
                value,
                infinite: true,
            };
        });
    },

    objectFields: (object, formName, forms) => {
        const keys = Object.keys(object);
        let objFields = [];

        for (let i = 0; i < keys.length; i++) {
            const currentField = keys[i];
            const value = object[currentField];

            if (
                mapFields(formName).indexOf(currentField) > -1 &&
                (value || typeof value === 'boolean')
            ) {
                // TODO test Array.isArray
                const infinite = isArray(value);
                const uid = getUniqueId(formName, 'general', currentField);

                // check no unSaved field exists
                if (isFieldUnSaved(forms, formName, uid)) {
                    objFields.push(
                        ...fields[infinite](
                            value,
                            'general',
                            '',
                            currentField,
                            formName
                        )
                    );
                }
            }
        }

        return objFields;
    },

    subObjectsFields: (subObjects, formName) => {
        const subObjectsFields = [];

        for (let i = 0; i < subObjects.length; i++) {
            const { data, subObject } = subObjects[i];

            data.map((field, id) => {
                const sections = Object.keys(field);

                for (let j = 0; j < sections.length; j++) {
                    const currentField = sections[j];

                    const value = field[currentField];

                    // TODO handle nested data
                    if (
                        mapFields(formName).indexOf(currentField) > -1 &&
                        (value || typeof value === 'boolean')
                    ) {
                        // TODO test Array.isArray
                        const infinite = isArray(value);

                        subObjectsFields.push(
                            ...fields[infinite](
                                value,
                                subObject,
                                field.id || id + 1,
                                currentField,
                                formName
                            )
                        );
                    }
                }
            });
        }

        return subObjectsFields;
    },

    initFormSections: async (object, id, formName, storeObjects, filter) => {
        const objectData = await dataFormService.getObjectData(
            object,
            id,
            subObjects[object]
        );

        const fields = dataFormService.subObjectsFields(objectData, formName);

        const listFields = {
            true: (fields) => filter(fields),
            false: () => fields,
        };

        const checkStoreObject = storeObjects.indexOf(formName) > -1;

        if (checkStoreObject) {
            // indexDB
            await DBService.setList(
                listFields[!!filter](fields),
                formName,
                false
            );
        }

        return listFields[!!filter](fields);
    },

    getObjectData: async (object, id, subObjects) => {
        const promises = [];

        for (let i = 0; i < subObjects.length; i++) {
            const url = `/api/${object}/${id}/${subObjects[i].subObject}`;
            const requestOptions = fetchHelper.requestOptions('GET');

            promises.push({ url, requestOptions });
        }

        // GET all subObjects of the Object
        const res = await Promise.all(
            promises.map((obj) => fetch(obj.url, obj.requestOptions))
        );

        const jsonResponses = await Promise.all(
            res.flatMap((r) =>
                checkFlatMap[r.ok](fetchHelper.handleResponse(r))
            )
        );

        return fetchHelper.handleJsons(jsonResponses);
    },

    initSubObject: async (type, subObject, id) => {
        const requestOptions = fetchHelper.requestOptions('POST', {});

        return await fetch(`/api/${type}/${id}/${subObject}`, requestOptions)
            .then(async (resp) => await resp.clone().json())
            .catch((err) => {
                Promise.reject(err);
            });
    },

    infiniteSection: (sections, key, data) => {
        return sections.map((p) => {
            const value = data[key][p.validatorId];

            if (value) {
                return { ...p, value };
            } else {
                // TODO still needed ??
                return p;
            }
        });
    },

    getProp: (o, path) => {
        const object = Object.assign(o, {});

        if (path.length === 1) return object[path[0]];
        else if (path.length === 0) throw error;
        else {
            if (object[path[0]])
                return dataFormService.getProp(object[path[0]], path.slice(1));
            else {
                object[path[0]] = {};

                return dataFormService.getProp(object[path[0]], path.slice(1));
            }
        }
    },

    save: async (form, objectType, objectId, subObject) => {
        if (!form.length) {
            return Promise.reject(genericErrorMsg);
        }

        const sectionInfinite = !!getSubObjectId(subObject) || false;

        const subObjectType = sectionInfinite
            ? getSubObjectType(subObject)
            : subObject;
        const subObjectId = sectionInfinite ? getSubObjectId(subObject) : '';

        let bodyObject = {};
        let infiniteArray = [];

        for (let i = 0; i < form.length; i++) {
            const { uid, value, infinite } = form[i];

            if (infinite) {
                const field = matchRegex(`(?<=_).*(?=#)`, uid);
                const alreadyExists = infiniteArray.filter(
                    (elm) => Object.keys(elm).indexOf(field) > -1
                );

                if (!!alreadyExists.length) {
                    infiniteArray.map((obj) => {
                        obj[field] = [...obj[field], value];
                    });
                } else {
                    infiniteArray.push(objectValue[!!value](field, value));
                }

                const currentObj = infiniteArray.find((elm) => elm[field]);
                bodyObject[field] = currentObj[field];
            } else {
                const field = matchRegex(`([^\_]+)$`, uid);
                // TODO shitty null
                bodyObject[field] = value || null;
            }
        }

        const requestOptions = fetchHelper.requestOptions('PATCH', bodyObject);

        // handle case general or with subObject
        const url = {
            true: `/api/${objectType}/${objectId}/${subObjectType}/${subObjectId}`,
            false: `/api/${objectType}/${objectId}`,
        };
        const response = await fetch(
            url[!!(subObjectType && subObjectId)],
            requestOptions
        );

        return fetchHelper
            .handleResponse(response)
            .then(({ response }) => response)
            .catch((err) => {
                return Promise.reject(err);
            });
    },

    publish: async (id, type) => {
        const requestOptions = fetchHelper.requestOptions('PUT', {
            status: 'published',
        });

        const response = await fetch(`/api/${type}/${id}`, requestOptions);

        return fetchHelper
            .handleResponse(response)
            .then(({ data }) => data)
            .catch((err) => {
                return Promise.reject(err);
            });
    },
};

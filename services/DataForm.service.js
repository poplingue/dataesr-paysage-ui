import { structureSubObjects } from '../helpers/constants';
import { fetchHelper } from '../helpers/fetch';
import {
    getSubObjectId,
    getSubObjectType,
    getUniqueId,
    isArray,
    matchRegex,
} from '../helpers/utils';
import DBService from './DB.service';

const mapFields = {
    address: 'address',
    postalCode: 'postalCode',
    country: 'country',
    locality: 'locality',
    telephone: 'telephone',
    officialName: 'officialName',
    usualName: 'usualName',
    startDate: 'startDate',
    endDate: 'endDate',
    article: 'article',
    shortName: 'shortName',
    brandName: 'brandName',
    nameEn: 'nameEn',
    acronymFr: 'acronymFr',
    acronymEn: 'acronymEn',
    otherNames: 'currentName.otherNames',
    wikidata: 'identifiers',
    idref: 'identifiers',
    uai: 'identifiers',
    firstName: 'firstName',
    lastName: 'lastName',
    gender: 'gender.type',
    media: 'socialMedia.type',
    socialAccount: 'socialMedia.account',
};

const fieldMapping = {
    endDate: (uid, value) => dataFormService.mapDate(uid, value),
    startDate: (uid, value) => dataFormService.mapDate(uid, value),
};

const fields = {
    true: (...params) => dataFormService.infiniteField(params),
    false: (...params) => dataFormService.uniqueField(params),
};

export const dataFormService = {
    mapDate: (uid, value) => {
        let mapping = [];
        const splitedDate = value.split('-');
        const fieldId = {
            0: 'Year',
            1: 'Month',
            2: 'Day',
        };

        mapping.push({ uid, value });

        for (let i = 0; i < splitedDate.length; i = i + 1) {
            mapping.push({
                uid: `${uid}${fieldId[i]}`,
                value: splitedDate[i],
                unSaved: false,
            });
        }

        return mapping;
    },

    cleanDateFormat: (field) => {
        const subObjectType = matchRegex(`([^\_]+)$`, field.uid);
        const needClean = ['endDate', 'startDate'].indexOf(subObjectType) > -1;

        if (needClean) {
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

        const uid = getUniqueId(formName, `${subObject}#${sectionId}`, field);

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

        return values.map((value, vIndex) => {
            const uid = getUniqueId(
                formName,
                `${subObject}#${sectionId}`,
                field,
                vIndex
            );

            return {
                uid,
                value,
                infinite: true,
            };
        });
    },

    subObjectsFields: (subObjects, formName) => {
        const subObjectsFields = [];

        for (let i = 0; i < subObjects.length; i++) {
            const { data, subObject } = subObjects[i];

            data.map((section, sectionId) => {
                const sections = Object.keys(section);

                for (let j = 0; j < sections.length; j++) {
                    const field = sections[j];

                    const value = section[field];

                    if (mapFields[field] && value) {
                        const infinite = isArray(value);
                        subObjectsFields.push(
                            ...fields[infinite](
                                value,
                                subObject,
                                section.id || sectionId + 1,
                                field,
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
        const structureData = await dataFormService.getObjectData(
            object,
            id,
            structureSubObjects
        );

        const fields = dataFormService.subObjectsFields(
            structureData,
            formName
        );

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

        // GET all subObjects of an Object
        // TODO add Promise.allSettled()
        const res = await Promise.all(
            promises.map((obj) => fetch(obj.url, obj.requestOptions))
        );

        // TODO add Promise.allSettled()
        const jsons = await Promise.all(
            res.map((r) => fetchHelper.handleResponse(r))
        );

        return fetchHelper.handleJsons(jsons);
    },

    initSubObject: async (type, subObject, id) => {
        const requestOptions = fetchHelper.requestOptions('POST', {});

        return await fetch(`/api/${type}/${id}/${subObject}`, requestOptions)
            .then(async (resp) => {
                return await resp.clone().json();
            })
            .catch((err) => {
                Promise.reject(err);
            });
    },
    infiniteFields: (data, formName, subObject) => {
        const fields = [];

        for (let i = 0; i < Object.keys(mapFields).length; i++) {
            const path = mapFields[Object.keys(mapFields)[i]];
            const validatorId = Object.keys(mapFields)[i];

            if (path) {
                let dataValue =
                    dataFormService.getProp(data, path.split('.')) || [];

                for (let j = 0; j < dataValue.length; j++) {
                    const uid = getUniqueId(
                        formName,
                        subObject,
                        validatorId,
                        j
                    );
                    fields.push({ uid, value: dataValue[j] });
                }
            }
        }

        return fields;
    },

    mapping: ({ form }, data) => {
        let copy = [...form];
        let newForm = [];

        for (let i = 0; i < copy.length; i++) {
            let newContent = [];
            let section = { ...copy[i] };
            let contentSection = copy[i].content;
            let infiniteSection = copy[i].infinite;

            if (infiniteSection) {
                if (Object.keys(data).indexOf('socialMedia') > -1) {
                    const frontSections = dataFormService.socialMediaSection(
                        data.socialMedia,
                        contentSection,
                        copy[i]
                    );
                    newForm = [...frontSections];
                }

                // TODO make it generic
                if (Object.keys(data).indexOf('currentName') > -1) {
                    newContent = dataFormService.infiniteSection(
                        contentSection,
                        'currentName',
                        data
                    );
                }
            } else {
                let fieldWithValue;

                for (let k = 0; k < contentSection.length; k++) {
                    const currentSection = contentSection[k];
                    const path = mapFields[currentSection.validatorId];
                    let newField = null;

                    if (path) {
                        let dataValue = dataFormService.getProp(
                            data,
                            path.split('.')
                        );

                        if (isArray(dataValue)) {
                            const dataField = dataValue.find((elm) => {
                                return elm.type === currentSection.validatorId;
                            });

                            dataValue = dataField ? dataField.value : '';
                        }

                        fieldWithValue = {
                            ...currentSection,
                            value: dataValue,
                        };

                        // TODO check necessary loop in loop
                        contentSection.map((field, j) => {
                            if (
                                field.validatorId === fieldWithValue.validatorId
                            ) {
                                newField = fieldWithValue;
                            } else if (
                                j === contentSection[j].length &&
                                field.validatorId !== fieldWithValue.validatorId
                            ) {
                                newField = field;
                            }
                        });

                        newContent.push(newField);
                    }
                }
            }

            if (!!newContent.length) {
                section.content = newContent;
                newForm.push(section);
            }
        }

        return { form: newForm };
    },
    socialMediaSection: (data, contentSection, copy) => {
        return data.map((m) => {
            const z = contentSection.map((c) => {
                const path = mapFields[c.validatorId];

                if (path === 'socialMedia.account') {
                    return { ...c, value: m.account };
                }

                if (path === 'socialMedia.type') {
                    return { ...c, value: m.type };
                }
            });

            return { ...copy, content: z };
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

    getSubObjectData: async (object, id, subObject) => {
        const url = `/api/${object}/${id}/${subObject}`;
        const requestOptions = fetchHelper.requestOptions('GET');

        const response = await fetch(url, requestOptions);

        return fetchHelper.handleResponse(response);
    },

    save: async (form, objectId, subObject) => {
        const sectionInfinite = !!getSubObjectId(subObject) || false;

        const subObjectType = sectionInfinite
            ? getSubObjectType(subObject)
            : subObject;
        const subObjectId = sectionInfinite ? getSubObjectId(subObject) : '';

        let bodyObject = {};
        let infiniteArray = [];

        for (let i = 0; i < form.length; i++) {
            const { uid, value, infinite } = form[i];

            if (infinite && value) {
                const field = matchRegex(`(?<=_).*(?=#)`, uid);
                const o = { [field]: [value] };
                const alreadyExists = infiniteArray.filter(
                    (elm) => Object.keys(elm).indexOf(field) > -1
                );

                if (!!alreadyExists.length) {
                    infiniteArray.map((obj) => {
                        obj[field] = [...obj[field], value];
                    });
                } else {
                    infiniteArray.push(o);
                }

                const currentObj = infiniteArray.find((elm) => elm[field]);
                bodyObject[field] = currentObj[field];
            } else {
                const field = matchRegex(`([^\_]+)$`, uid);
                bodyObject[field] = value;
            }
        }

        const requestOptions = fetchHelper.requestOptions('PATCH', bodyObject);
        const response = await fetch(
            `/api/structure/${objectId}/${subObjectType}/${subObjectId}`,
            requestOptions
        );

        return fetchHelper
            .handleResponse(response)
            .then(({ response }) => {
                return response;
            })
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

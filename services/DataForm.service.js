import { fetchHelper } from '../helpers/fetch';
import {
    getUniqueId,
    isArray,
    lastChar,
    matchRegex,
    sliceEnd,
} from '../helpers/utils';

const mapFields = {
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
    otherName: 'currentName.otherName',
    wikidata: 'identifiers',
    idref: 'identifiers',
    uai: 'identifiers',
    firstName: 'firstName',
    lastName: 'lastName',
    gender: 'gender.type',
    media: 'socialMedia.type',
    socialAccount: 'socialMedia.account',
};

export const dataFormService = {
    mapDate: () => {
        const day = 'xx-xx-31';

        return {
            day: '1',
            month: '12',
            year: '2022',
        };
    },
    familyFields: (field, index, form) => {
        // TODO refacto: work only with 1 infinite field in section
        const checkFamily = form.find((f) => f.infinite && f.unSaved);

        const obj = {
            false: () => '',
            true: (o) => o.uid,
        };

        const id = sliceEnd(obj[!!checkFamily](checkFamily));
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

    deleteField: async (
        object,
        objectId,
        subObjectType,
        subObjectId,
        toDelete
    ) => {
        const url = `/api/${object}/${objectId}/${subObjectType}/${subObjectId}`;
        const requestOptions = fetchHelper.requestOptions('DELETE', toDelete);

        return await fetch(url, requestOptions);
    },

    deleteSubObject: async (object, objectId, subObjectType, subObjectId) => {
        const url = `/api/${object}/${objectId}/${subObjectType}/${subObjectId}`;
        const requestOptions = fetchHelper.requestOptions('DELETE');

        return await fetch(url, requestOptions);
    },

    subObjectsFields: (subObjects, formName) => {
        const subObjectsFields = [];

        for (let i = 0; i < subObjects.length; i++) {
            const { data, subObject } = subObjects[i];

            data.map((section, dataIndex) => {
                const sections = Object.keys(section);

                for (let j = 0; j < sections.length; j++) {
                    const field = sections[j];
                    const value = section[field];

                    if (mapFields[field] && value) {
                        const infinite = isArray(value);

                        if (infinite) {
                            value.map((v, vIndex) => {
                                const uid = getUniqueId(
                                    formName,
                                    `${subObject}#${dataIndex + 1}`,
                                    field,
                                    vIndex
                                );
                                subObjectsFields.push({
                                    uid,
                                    value: v,
                                    infinite,
                                });
                            });
                        } else {
                            const uid = getUniqueId(
                                formName,
                                `${subObject}#${dataIndex + 1}`,
                                field
                            );
                            subObjectsFields.push({ uid, value });
                        }
                    }
                }
            });
        }

        return subObjectsFields;
    },

    getStructureData: async (object, id, subObjects) => {
        const promises = [];

        for (let i = 0; i < subObjects.length; i++) {
            const url = `/api/${object}/${id}/${subObjects[i].subObject}`;
            const requestOptions = fetchHelper.requestOptions('GET');

            promises.push({ url, requestOptions });
        }

        const res = await Promise.all(
            promises.map((obj) => fetch(obj.url, obj.requestOptions))
        );

        const jsons = await Promise.all(
            res.map((r) => fetchHelper.handleResponse(r))
        );

        return fetchHelper.handleJsons(jsons);
    },

    initSubObject: async (type, subObject, id) => {
        const requestOptions = fetchHelper.requestOptions('POST', {});

        return await fetch(
            `/api/${type}/${id}/${subObject}`,
            requestOptions
        ).then(async (resp) => {
            return await resp.clone().json();
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
    save: async (form, objectId, subObject) => {
        const sectionInfinite = !!subObject.match(/\d+$/)[0];

        const subObjectType = sectionInfinite ? sliceEnd(subObject) : subObject;
        const subObjectId = sectionInfinite ? lastChar(subObject) : '';

        let bodyObject = {};
        let infiniteArray = [];

        for (let i = 0; i < form.length; i++) {
            const { uid, value, infinite } = form[i];

            if (infinite) {
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

        const r = await response.json();

        if (response.status >= 400) {
            console.error('==== Err ==== ', r);
            throw r.error;
        }

        if (response.status >= 200 && response.status < 400) {
            return r;
        }
    },
};

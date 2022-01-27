import { fetchHelper } from '../helpers/fetch';
import { getUniqueId, isArray } from '../helpers/utils';

const mapFields = {
    officialName: 'officialName',
    usualName: 'usualName',
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
    deleteField: async (
        object,
        objectId,
        subObjectType,
        subObjectId,
        toDelete
    ) => {
        // TODO merge with deleteSubObject
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

        console.log('==== newForm ==== ', newForm);

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
        const reg = new RegExp(`(?<=_).*(?=#)`, 'g');
        const subObjectType = subObject.slice(0, -2);
        const subObjectId = subObject.slice(-1);

        let bodyObject = {};
        let infiniteArray = [];

        for (let i = 0; i < form.length; i++) {
            const current = form[i];
            const match = current.uid.match(reg);
            const key = match[0];

            if (current.infinite) {
                const o = { [key]: [current.value] };
                const alreadyExists = infiniteArray.filter(
                    (elm) => Object.keys(elm).indexOf(key) > -1
                );

                if (!!alreadyExists.length) {
                    infiniteArray.map((obj) => {
                        obj[key] = [...obj[key], current.value];
                    });
                } else {
                    infiniteArray.push(o);
                }
            }

            if (!!match.length) {
                const infiniteObj = infiniteArray.find((elm) => elm[key]);
                bodyObject[key] = !!infiniteArray.length
                    ? infiniteObj[key]
                    : current.value;
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

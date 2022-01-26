import { fetchHelper } from '../helpers/fetch';

const mapFields = {
    officialName: 'officialName',
    usualName: 'usualName',
    shortName: 'shortName',
    brandName: 'brandName',
    nameEn: 'nameEn',
    acronymFr: 'acronymFr',
    acronymEn: 'acronymEn',
    otherName: 'otherName',
    wikidata: 'identifiers',
    idref: 'identifiers',
    uai: 'identifiers',
    firstName: 'firstName',
    lastName: 'lastName',
    gender: 'gender.type',
    media: 'socialMedia.type',
    socialAccount: 'socialMedia.account',
    names: 'socialMedia.account',
};

export const dataFormService = {
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

                        // Case array
                        if (dataValue && dataValue.indexOf('') < 0) {
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
    save: async (form, objectId, subObject, subObjectId = '') => {
        const reg = new RegExp(`(?<=_).*(?=#)`, 'g');
        let bodyObject = {};
        let infiniteArray = [];

        if (subObjectId) {
            subObject = subObject.slice(0, -2);
        }

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
            `/api/structure/${objectId}/${subObject}/${subObjectId}`,
            requestOptions
        );

        const r = await response.json();

        if (response.status >= 400) {
            console.error('==== Err ==== ', r);
            throw r.error;
        }

        if (response.status >= 200 && response.status < 400) {
            debugger; // eslint-disable-line

            return r.text();
        }
    },
};


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
                // TODO make it generic
                if (Object.keys(data).indexOf('socialMedia') > -1) {
                    const frontSections = dataFormService.socialMediaSection(
                        data.socialMedia,
                        contentSection,
                        copy[i]
                    );
                    newForm = [...frontSections];
                }
            } else {
                let fieldWithValue;

                for (let k = 0; k < contentSection.length; k++) {
                    let newField = null;
                    const path = mapFields[contentSection[k].validatorId];

                    if (path) {
                        let dataValue = dataFormService.getProp(
                            data,
                            path.split('.')
                        );

                        // Case array
                        if (dataValue && dataValue.indexOf('') < 0) {
                            const dataField = dataValue.find((elm) => {
                                return (
                                    elm.type === contentSection[k].validatorId
                                );
                            });

                            dataValue = dataField ? dataField.value : '';
                        }

                        fieldWithValue = {
                            ...contentSection[k],
                            value: dataValue,
                        };

                        contentSection.map((field, k) => {
                            if (
                                field.validatorId === fieldWithValue.validatorId
                            ) {
                                newField = fieldWithValue;
                            } else if (
                                k === contentSection[k].length &&
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
    getProp: (o, path) => {
        if (path.indexOf('x') >= 0) {
        }

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
    save: async (objectId, subObject, form) => {
        const reg = new RegExp(`(?<=€).*(?=#)`, 'g');
        let bodyObject = {};

        for (let i = 0; i < form.length; i++) {
            const current = form[i];
            const match = current.uid.match(reg);

            if (!!match.length) {
                const key = match[0];
                bodyObject[key] = current.value;
            }
        }

        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyObject),
        };

        await fetch(`/api/structure/${objectId}/${subObject}`, requestOptions);
    },
};

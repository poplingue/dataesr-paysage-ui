const mapFields = {
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
        let section = {};

        for (let i = 0; i < copy.length; i++) {
            let contentSection = copy[i].content;
            let infiniteSection = copy[i].infinite;
            section = { ...copy[i] };
            let fieldWithValue;
            let newContent = [];

            if (infiniteSection) {
                let x = [];
                let o = {};
                let s = [];

                data.socialMedia.map((m) => {
                    s = [];
                    let g = {};

                    const z = contentSection.map((c) => {
                        const path = mapFields[c.validatorId];

                        if (path === 'socialMedia.account') {
                            return { ...c, value: m.account };
                        }

                        if (path === 'socialMedia.type') {
                            return { ...c, value: m.type };
                        }
                    });

                    o = { ...copy[i], content: z };

                    debugger; // eslint-disable-line

                    if (Object.keys(o).length > 0) {
                        newForm.push(o);
                    }
                });
            }

            for (let k = 0; k < contentSection.length; k++) {
                if (!infiniteSection) {
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

            section.content = newContent;
            newForm.push(section);
        }

        console.log('==== LOG ==== ', newForm);

        return { form: newForm };
    },
    getPosition: () => {},
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
};

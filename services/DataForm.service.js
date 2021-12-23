const mapFields = {
    wikidata: 'identifiers',
    idref: 'identifiers',
    uai: 'identifiers',
    firstName: 'firstName',
    lastName: 'lastName',
    gender: 'gender.type',
};

export const dataFormService = {
    mapping: ({ form }, data) => {
        let copy = [...form];
        let newForm = [];
        let section = {};

        for (let i = 0; i < copy.length; i++) {
            let contentSection = copy[i].content;
            section = { ...copy[i] };
            let fieldWithValue;
            let newContent = [];

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
                        const dataField = dataValue.find(
                            (elm) => elm.type === contentSection[k].validatorId
                        );
                        dataValue = dataField ? dataField.value : '';
                    }

                    fieldWithValue = { ...contentSection[k], value: dataValue };

                    contentSection.map((field, k) => {
                        if (field.validatorId === fieldWithValue.validatorId) {
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

            section.content = newContent;
            newForm.push(section);
        }

        return { form: newForm };
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
};

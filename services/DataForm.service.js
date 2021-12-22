export const dataFormService = {
    mapping: ({ form }, data) => {
        const o = {
            wikidata: 'identifiers',
            firstName: 'firstName',
        };

        let newForm = [...form];
        let f = [];
        let v = {};

        for (let i = 0; i < newForm.length; i++) {
            let section = newForm[i].content;
            v = { ...newForm[i] };
            let w;

            for (let j = 0; j < section.length; j++) {
                const path = o[section[j].validatorId];

                if (path) {
                    const d = getProp(data, path.split('.'));

                    if (d.indexOf('') < 0) {
                        const data = d.find(
                            (elm) => elm.type === section[j].validatorId
                        );
                        const s = { ...section[j], value: data.value };
                        const o = Object.assign({}, section[j], s);
                        // w = [...newForm[i].content, o];

                        w = newForm[i].content.map((elm) => {
                            return elm.validatorId === o.validatorId ? o : elm;
                        });
                    } else {
                        const s = { ...section[j], value: d };
                        // w = [...newForm[i].content, Object.assign({}, section[j], s)];
                        w = newForm[i].content.map((elm) => {
                            return elm.validatorId === o.validatorId ? s : elm;
                        });
                    }
                }
            }

            v.content = w;
            f.push(v);
        }

        return { form: f };
    },
};

const getProp = (o, path) => {
    const object = Object.assign(o, {});

    if (path.length === 1) return object[path[0]];
    else if (path.length === 0) throw error;
    else {
        if (object[path[0]]) return getProp(object[path[0]], path.slice(1));
        else {
            object[path[0]] = {};

            return getProp(object[path[0]], path.slice(1));
        }
    }
};

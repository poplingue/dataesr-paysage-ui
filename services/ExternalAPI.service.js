import getConfig from 'next/config';
import { fetchHelper } from '../helpers/fetch';

export const externalAPI = {
    getPromiseWithAbort(p) {
        let obj = {};
        //A new promise is set internally to terminate the execution
        let p1 = new Promise(function (resolve, reject) {
            obj.abort = reject;
        });

        obj.promise = Promise.race([p, p1]);

        return obj;
    },
    async ods(query, validatorId) {
        const { publicRuntimeConfig } = getConfig();
        const cleanQuery = query.replaceAll(' ', '+');
        const url = `${publicRuntimeConfig.baseApiUrl}/consumer?q=${cleanQuery}&validatorId=${validatorId}`;

        const requestOptions = fetchHelper.requestOptions('GET');

        const response = await fetch(url, requestOptions);

        return fetchHelper
            .handleResponse(response)
            .then(({ response }) =>
                response.json().then((r) => {
                    return externalAPI[validatorId](r.records);
                })
            )
            .catch((err) => {
                return Promise.reject(err);
            });
    },

    locality(records) {
        return records.map((r) => {
            return {
                label: `${r.fields.com_name} - ${r.fields.com_code}`,
                value: r.fields.com_name,
            };
        });
    },
};

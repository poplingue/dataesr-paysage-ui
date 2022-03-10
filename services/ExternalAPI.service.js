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
                response
                    .json()
                    .then((r) => externalAPI[`ods_${validatorId}`](r.records))
            )
            .catch((err) => {
                return Promise.reject(err);
            });
    },

    ods_locality(records) {
        return records.map((r) => {
            return {
                suggestion: {
                    label: `${r.fields.com_name} - ${r.fields.com_code}`,
                    value: r.fields.com_name,
                },
                updates: [
                    {
                        validatorId: 'postalCode',
                        value: r.fields.com_current_code,
                    },
                    {
                        validatorId: 'latitude',
                        value: r.fields.geo_point_2d[0].toString(),
                    },
                    {
                        validatorId: 'longitude',
                        value: r.fields.geo_point_2d[1].toString(),
                    },
                    {
                        validatorId: 'country',
                        value: 'France',
                    },
                ],
            };
        });
    },
};

import getConfig from 'next/config';
import { fetchHelper } from '../helpers/fetch';

export const externalAPI = {
    getPromiseWithAbort(promise) {
        let obj = {};
        // a new promise is set internally to terminate the execution
        let newPromise = new Promise(function (resolve, reject) {
            obj.abort = reject;
        });

        obj.promise = Promise.race([promise, newPromise]);

        return obj;
    },
    async openDataSoft(query, validatorId) {
        const { publicRuntimeConfig } = getConfig();
        const cleanQuery = query.replaceAll(' ', '%20');

        const url = `${publicRuntimeConfig.baseApiUrl}/public?validatorId=${validatorId}`;
        const body = {
            where: ` com_name%20like%20%22${cleanQuery}*%22`,
            order_by: 'com_name%20ASC',
        };

        const requestOptions = fetchHelper.requestOptions('POST', body);

        const response = await fetch(url, requestOptions);

        return fetchHelper
            .handleResponse(response)
            .then(({ response }) =>
                response
                    .json()
                    .then((data) =>
                        externalAPI[`openDataSoft_${validatorId}`](data.records)
                    )
            )
            .catch((err) => {
                return Promise.reject(err);
            });
    },

    openDataSoft_locality(records) {
        return records.map(({ record }) => {
            const { fields } = record;

            return {
                suggestion: {
                    label: `${fields.com_name[0]} - ${fields.com_code[0]}`,
                    value: fields.com_name[0],
                },
                updates: [
                    {
                        validatorId: 'postalCode',
                        value: fields.com_current_code[0],
                    },
                    {
                        validatorId: 'latitude',
                        value: fields.geo_point_2d.lat.toString(),
                    },
                    {
                        validatorId: 'longitude',
                        value: fields.geo_point_2d.lon.toString(),
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

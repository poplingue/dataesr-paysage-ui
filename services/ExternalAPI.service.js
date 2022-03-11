import getConfig from 'next/config';
import { fetchHelper } from '../helpers/fetch';

export const externalAPI = {
    getAPI(validatorId) {
        const typesByValidatorId = {
            address: externalAPI.dataGouv,
            locality: externalAPI.openDataSoft,
        };

        return typesByValidatorId[validatorId];
    },

    getPromiseWithAbort(promise) {
        let obj = {};
        // a new promise is set internally to terminate the execution
        let newPromise = new Promise(function (resolve, reject) {
            obj.abort = reject;
        });

        obj.promise = Promise.race([promise, newPromise]);

        return obj;
    },

    async handleResp(body, validatorId, key) {
        const { publicRuntimeConfig } = getConfig();

        const url = `${publicRuntimeConfig.baseApiUrl}/public?validatorId=${validatorId}`;

        const requestOptions = fetchHelper.requestOptions('POST', body);

        const response = await fetch(url, requestOptions);

        return fetchHelper
            .handleResponse(response)
            .then(({ response }) =>
                response
                    .json()
                    .then((data) => externalAPI[`${key}_${validatorId}`](data))
            )
            .catch((err) => {
                return Promise.reject(err);
            });
    },
    async dataGouv(query, validatorId) {
        const cleanQuery = query.replaceAll(' ', '+');
        const body = {
            q: cleanQuery,
        };

        return externalAPI.handleResp(body, validatorId, 'dataGouv');
    },

    async openDataSoft(query, validatorId) {
        const cleanQuery = query.replaceAll(' ', '%20');
        const body = {
            where: `com_name%20like%20%22${cleanQuery}*%22`,
            order_by: 'com_name%20ASC',
        };

        return externalAPI.handleResp(body, validatorId, 'openDataSoft');
    },

    dataGouv_address({ features }) {
        return features.map((feature) => {
            const { properties, geometry } = feature;

            return {
                suggestion: {
                    label: properties.label,
                    value: properties.name,
                },
                updates: [
                    {
                        validatorId: 'locality',
                        value: properties.city,
                    },
                    {
                        validatorId: 'postalCode',
                        value: properties.postcode,
                    },
                    {
                        validatorId: 'latitude',
                        value: geometry.coordinates[1].toString(),
                    },
                    {
                        validatorId: 'longitude',
                        value: geometry.coordinates[0].toString(),
                    },
                    {
                        validatorId: 'country',
                        value: 'France',
                    },
                ],
            };
        });
    },

    openDataSoft_locality({ records }) {
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

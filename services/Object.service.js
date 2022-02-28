import getConfig from 'next/config';
import { getObjectType } from '../helpers/constants';
import { fetchHelper } from '../helpers/fetch';
import { genericErrorMsg } from '../helpers/internalMessages';

export const objectService = {
    newId: async (message) => {
        const newObject = JSON.parse(message);

        if (newObject.status < 400 && newObject.status >= 200) {
            return newObject.data.object.id;
        } else {
            throw genericErrorMsg;
        }
    },
    getOne: async (objectType, objectId) => {
        const { publicRuntimeConfig } = getConfig();
        const url = `${publicRuntimeConfig.baseApiUrl}/${objectType}/${objectId}`;
        const requestOptions = fetchHelper.requestOptions('GET');

        const response = await fetch(url, requestOptions);

        return fetchHelper
            .handleResponse(response)
            .then(({ data }) => {
                return Promise.resolve(data);
            })
            .catch((err) => {});
    },
    getAll: async (objectCode) => {
        const { publicRuntimeConfig } = getConfig();
        const url = `${publicRuntimeConfig.baseApiUrl}/${
            getObjectType(objectCode).name
        }`;

        const requestOptions = fetchHelper.requestOptions('GET');

        const response = await fetch(url, requestOptions);

        return fetchHelper
            .handleResponse(response)
            .then(({ data }) => {
                return Promise.resolve(data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    },
    getSubObject: async (type, id, subObject) => {
        const { publicRuntimeConfig } = getConfig();

        const url = `${publicRuntimeConfig.baseApiUrl}/${type}/${id}/${subObject}`;

        const requestOptions = fetchHelper.requestOptions('GET');

        const response = await fetch(url, requestOptions);

        return fetchHelper
            .handleResponse(response)
            .then(({ data }) => {
                return Promise.resolve(data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    },

    handlerMainLocalisation: () => {
        return {
            get(target, property) {
                return property === 'fullAddress'
                    ? `${target.address} ${target.postalCode} ${target.locality} ${target.country}`
                    : target[property];
            },
        };
    },
};

export default objectService;

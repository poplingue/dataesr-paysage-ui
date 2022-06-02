import getConfig from 'next/config';
import { getObjectTypeDetails } from '../config/utils';
import { fetchHelper } from '../helpers/fetch';
import { genericErrorMsg } from '../helpers/internalMessages';
import { niceFullDate } from '../helpers/utils';

export const objectService = {
    newId: async (message) => {
        const newObject = JSON.parse(message);

        if (newObject.status < 400 && newObject.status >= 200) {
            return newObject.data.id;
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
            .catch((err) => {
                return Promise.reject(err);
            });
    },
    getAll: async (objectCode) => {
        const { publicRuntimeConfig } = getConfig();
        const { name } = getObjectTypeDetails(objectCode);

        const url = `${publicRuntimeConfig.baseApiUrl}/${name}`;

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

    getSubObjectData: async (type, id, subObject) => {
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

    getResource: async (type, id, subObject, subObjectId) => {
        const { publicRuntimeConfig } = getConfig();

        const url = `${publicRuntimeConfig.baseApiUrl}/${type}/${id}/${subObject}/${subObjectId}`;

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

    handlerUser: () => {
        return {
            get(target, property) {
                if (property === 'fullName') {
                    return `${target.firstName} ${target.lastName}`;
                }

                return target[property];
            },
        };
    },

    handlerMainName: () => {
        return {
            get(target, property) {
                if (property === 'startDate') {
                    return niceFullDate(target.startDate);
                }

                return target[property];
            },
        };
    },

    handlerObjectInfo: () => {
        return {
            get(target, property) {
                // case Person
                if (
                    property === 'mainTitle' &&
                    target.firstName &&
                    target.lastName
                ) {
                    return `${target.firstName} ${target.lastName}`;
                }

                // case Structure
                if (
                    property === 'mainTitle' &&
                    target.currentName &&
                    target.currentName.officialName
                ) {
                    return target.currentName.officialName;
                }

                return target[property];
            },
        };
    },

    handlerInfoPerson: () => {
        return {
            get(target, property) {
                if (property === 'fullName') {
                    return `${target.firstName || ''} ${target.lastName || ''}`;
                }

                return target[property];
            },
        };
    },

    handlerMainLocalisation: () => {
        return {
            get(target, property) {
                if (property === 'fullAddress') {
                    return `${target.address || ''} ${
                        target.postalCode || ''
                    } ${target.locality || ''} ${target.country || ''}`;
                }

                if (property === 'coordinates') {
                    return target.coordinates &&
                        Object.keys(target.coordinates).length > 0
                        ? target[property]
                        : null;
                }

                return target[property];
            },
        };
    },
};

export default objectService;

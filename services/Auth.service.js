import getConfig from 'next/config';
import { fetchHelper } from '../helpers/fetch';
import {
    combinationError,
    emailErrorMsg,
    genericErrorMsg,
    passwordErrorMsg,
    invalidToken,
} from '../helpers/internalMessages';

const authService = {
    signup: async (userData) => {
        const { publicRuntimeConfig } = getConfig();
        const url = `${publicRuntimeConfig.baseApiUrl}/auth/signup`;
        const requestOptions = fetchHelper.requestOptions('POST', userData);

        const response = await fetch(url, requestOptions);

        return fetchHelper
            .handleResponse(response)
            .then(({ response }) => {
                return response;
            })
            .catch((err) => {
                console.error('==== Err ==== ', err);

                return Promise.reject(err);
            });
    },
    activate: async (code) => {
        const { publicRuntimeConfig } = getConfig();
        const url = `${publicRuntimeConfig.baseApiUrl}/auth/activate-account`;
        const requestOptions = fetchHelper.requestOptions('POST', code);

        try {
            const response = await fetch(url, requestOptions);

            return fetchHelper
                .handleResponse(response)
                .then(async ({ response, data }) => {
                    return { response, data };
                })
                .catch((err) => {
                    if (err === invalidToken) {
                        return authService
                            .refreshAccessToken()
                            .then(async () => {
                                const r = await fetch(url, requestOptions);

                                return fetchHelper
                                    .handleResponse(r)
                                    .then(async (response) => {
                                        return { response };
                                    });
                            });
                    } else {
                        return Promise.reject(err);
                    }
                });
        } catch (err) {
            return Promise.reject(err);
        }
    },
    renewActivationCode: async () => {
        const { publicRuntimeConfig } = getConfig();
        const url = `${publicRuntimeConfig.baseApiUrl}/auth/renew-activation-code`;
        const requestOptions = fetchHelper.requestOptions('GET', null);

        const response = await fetch(url, requestOptions);

        return fetchHelper
            .handleResponse(response)
            .then(({ response, data }) => {
                return { response, data };
            })
            .catch((err) => {
                if (err === invalidToken) {
                    return authService
                        .refreshAccessToken()
                        .then(async () => {
                            const r = await fetch(url, requestOptions);

                            return fetchHelper
                                .handleResponse(r)
                                .then(async (response) => {
                                    return response;
                                });
                        })
                        .catch((err) => {
                            authService.signOut();

                            return Promise.reject(err);
                        });
                }

                return Promise.reject(err);
            });
    },
    signIn: async (userData) => {
        const { publicRuntimeConfig } = getConfig();
        const url = `${publicRuntimeConfig.baseApiUrl}/auth/sign-in`;
        const requestOptions = fetchHelper.requestOptions('POST', userData);

        const response = await fetch(url, requestOptions);

        return fetchHelper
            .handleResponse(response)
            .then(({ response }) => {
                return response;
            })
            .catch((err) => {
                if (err === genericErrorMsg) {
                    return Promise.reject(emailErrorMsg);
                }

                if (err === combinationError) {
                    return Promise.reject(passwordErrorMsg);
                }

                return Promise.reject(err);
            });
    },
    signOut: async () => {
        const { publicRuntimeConfig } = getConfig();
        const url = `${publicRuntimeConfig.baseApiUrl}/auth/sign-out`;
        const requestOptions = fetchHelper.requestOptions('POST');

        const response = await fetch(url, requestOptions);

        return fetchHelper
            .handleResponse(response)
            .then(({ response }) => {
                return { response };
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    },
    resetPassword: async (userData) => {
        const { publicRuntimeConfig } = getConfig();
        const url = `${publicRuntimeConfig.baseApiUrl}/auth/reset-password`;
        const requestOptions = fetchHelper.requestOptions('POST', userData);

        const response = await fetch(url, requestOptions);

        return fetchHelper
            .handleResponse(response)
            .then(({ response, data }) => {
                return { response, data };
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    },
    refreshAccessToken: async (refreshTokenUrl) => {
        const { publicRuntimeConfig } = getConfig();
        const url =
            refreshTokenUrl ||
            `${publicRuntimeConfig.baseApiUrl}/auth/refresh-access-token`;

        // TODO requestOtion refacto
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
            credentials: 'include',
        });

        return fetchHelper
            .handleResponse(response)
            .then(({ response, data }) => {
                console.log('==== Tokens refreshed ==== ');

                return { response, data };
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    },
    forgotPassword: async (email) => {
        const { publicRuntimeConfig } = getConfig();
        const url = `${publicRuntimeConfig.baseApiUrl}/auth/send-password-renewal-code`;
        const requestOptions = fetchHelper.requestOptions('POST', email);

        const response = await fetch(url, requestOptions);

        return fetchHelper
            .handleResponse(response)
            .then((response) => {
                return { response, email };
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    },
};

export default authService;

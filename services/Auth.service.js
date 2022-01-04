import Cookies from 'js-cookie';
import getConfig from 'next/config';
import { fetchHelper } from '../helpers/fetch';

import {
    combinationError,
    emailErrorMsg,
    genericErrorMsg,
    passwordErrorMsg,
    tokenError,
} from '../helpers/internalMessages';

const authService = {
    signup: async (userData) => {
        const { publicRuntimeConfig } = getConfig();
        const url = `${publicRuntimeConfig.baseApiUrl}/auth/signup`;

        // TODO Tidy options
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(userData),
        };

        const response = await fetch(url, requestOptions);

        return fetchHelper
            .handleResponse(response)
            .then(({ response, data }) => {
                if (response.status >= 200 && response.status < 400) {
                    Cookies.set('tokens', JSON.stringify(data));
                }

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

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(code),
            credentials: 'include',
        };

        try {
            const response = await fetch(url, requestOptions);

            return fetchHelper
                .handleResponse(response)
                .then(async ({ response, data }) => {
                    return { response, data };
                })
                .catch((err) => {
                    if (err === tokenError) {
                        authService
                            .refreshAccessToken()
                            .then(async (response) => {
                                await fetch(url, requestOptions);

                                return fetchHelper
                                    .handleResponse(response)
                                    .then(async (response) => {
                                        return response;
                                    })
                                    .catch((err) => {
                                        return Promise.reject(err);
                                    });
                            });
                    }

                    return Promise.reject(err);
                });
        } catch (err) {
            return Promise.reject(err);
        }
    },
    renewActivationCode: async () => {
        const { publicRuntimeConfig } = getConfig();
        const url = `${publicRuntimeConfig.baseApiUrl}/auth/renew-activation-code`;

        // TODO Tidy options
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        };

        const response = await fetch(url, requestOptions);

        return fetchHelper
            .handleResponse(response)
            .then(({ response, data }) => {
                return { response, data };
            })
            .catch((err) => {
                if (err === tokenError) {
                    authService
                        .refreshAccessToken()
                        .then(async () => {
                            const response = await fetch(url, requestOptions);

                            return fetchHelper
                                .handleResponse(response)
                                .then(async (response) => {
                                    return response;
                                })
                                .catch((err) => {
                                    return Promise.reject(err);
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

        // TODO Tidy options
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(userData),
        };

        const response = await fetch(url, requestOptions);

        return fetchHelper
            .handleResponse(response)
            .then(({ response, data }) => {
                if (response.status >= 200 && response.status < 400) {
                    Cookies.set('tokens', JSON.stringify(data));
                }

                return response;
            })
            .catch((err) => {
                console.error('==== SignIn Error ==== ', err);

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
        // TODO auth/signout
        try {
            if (Cookies.get('tokens')) {
                Cookies.remove('tokens');
            }

            return 'Cookie tokens removed';
        } catch (err) {
            return Promise.reject(err);
        }
    },
    resetPassword: async (userData) => {
        const { publicRuntimeConfig } = getConfig();
        const url = `${publicRuntimeConfig.baseApiUrl}/auth/reset-password`;

        // TODO Tidy options
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(userData),
        };

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
    refreshAccessToken: async (refreshToken, refreshTokenUrl) => {
        const { publicRuntimeConfig } = getConfig();
        const url =
            refreshTokenUrl ||
            `${publicRuntimeConfig.baseApiUrl}/auth/refresh-access-token`;

        const tokens = Cookies.get('tokens')
            ? JSON.parse(Cookies.get('tokens'))
            : null;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                refreshToken:
                    tokens && Object.keys(tokens).length > 0
                        ? tokens.refreshToken
                        : refreshToken,
            }),
            credentials: 'include',
        });

        return fetchHelper
            .handleResponse(response)
            .then(({ response, data }) => {
                if (response.status >= 200 && response.status < 400) {
                    console.log('==== Tokens updated ==== ');
                    Cookies.set('tokens', JSON.stringify(data));
                }

                return { response, data };
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    },
    forgotPassword: async (email) => {
        const { publicRuntimeConfig } = getConfig();
        const url = `${publicRuntimeConfig.baseApiUrl}/auth/send-password-renewal-code`;

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(email),
            credentials: 'include',
        };

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

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

const { publicRuntimeConfig } = getConfig();

export const userService = {
    signup,
    activate,
    me,
    renewActivationCode,
    signIn,
    signOut,
    resetPassword,
    refreshAccessToken,
    forgotPassword,
};

async function signup(userData) {
    const url = `${publicRuntimeConfig.baseApiUrl}/user/signup`;

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
            return Promise.reject(err);
        });
}

async function resetPassword(userData) {
    const url = `${publicRuntimeConfig.baseApiUrl}/user/reset-password`;
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
}

async function renewActivationCode() {
    const url = `${publicRuntimeConfig.baseApiUrl}/user/renew-activation-code`;

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
                userService.refreshAccessToken().then(async () => {
                    const response = await fetch(url, requestOptions);

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
}

async function signIn(userData) {
    // TODO Tidy options
    const url = `${publicRuntimeConfig.baseApiUrl}/user/sign-in`;

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
            if (err === genericErrorMsg) {
                return Promise.reject(emailErrorMsg);
            }

            if (err === combinationError) {
                return Promise.reject(passwordErrorMsg);
            }

            return Promise.reject(err);
        });
}

async function activate(code) {
    const url = `${publicRuntimeConfig.baseApiUrl}/user/activate-account`;

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
                    userService.refreshAccessToken().then(async (response) => {
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
}

async function refreshAccessToken(refreshToken, refreshTokenUrl) {
    const url =
        refreshTokenUrl ||
        `${publicRuntimeConfig.baseApiUrl}/user/refresh-access-token`;
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
}

async function forgotPassword(email) {
    const url = `${publicRuntimeConfig.baseApiUrl}/user/send-password-renewal-code`;

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
}

async function me(tokens) {
    if (!Object.keys(tokens).length) {
        return Promise.reject('No tokens');
    }

    // TODO refacto options
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(tokens.accessToken),
    };

    const meUrl = `${publicRuntimeConfig.baseApiUrl}/user/me`;
    const tokenUrl = `${publicRuntimeConfig.baseApiUrl}/user/refresh-access-token`;

    const response = await fetch(meUrl, requestOptions);

    return fetchHelper
        .handleResponse(response)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((err) => {
            if (err === tokenError) {
                return userService
                    .refreshAccessToken(tokens.refreshToken, tokenUrl)
                    .then(async ({ data }) => {
                        const resp = await fetch(meUrl, {
                            ...requestOptions,
                            body: JSON.stringify(data.accessToken),
                        });

                        return Promise.resolve(
                            fetchHelper
                                .handleResponse(resp)
                                .then(async ({ data }) => {
                                    console.log('==== /me ==== ', data);

                                    return Promise.resolve(data);
                                })
                                .catch((err) => {
                                    console.log('==== LOG ==== ', err);

                                    return Promise.reject(err);
                                })
                        );
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            } else {
                return Promise.reject(err);
            }
        });
}

async function signOut() {
    Cookies.remove('tokens');

    return 'Tokens removed';
}

import Cookies from 'js-cookie';
import getConfig from 'next/config';
import { fetchHelper } from '../helpers/fetch';

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

export const userService = {
    signup,
    activate,
    me,
    signIn,
    renewalCode,
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
            debugger; // eslint-disable-line

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
                if (err === "Token d'access invalide ou expiré") {
                    userService.refreshAccessToken().then(async (response) => {
                        console.log(
                            '==== requestOptions ==== ',
                            requestOptions
                        );
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
    console.log('==== refreshToken ==== ', refreshToken);

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
            console.error('==== refreshAccessToken ==== ', err);

            return Promise.reject(err);
        });
}

async function renewalCode(email) {
    const url = `${publicRuntimeConfig.baseApiUrl}/user/renewal-code`;

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
            return response;
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
            return response;
        })
        .catch((err) => {
            return Promise.reject(err);
        });
}

async function me(tokens) {
    if (!Object.keys(tokens).length) {
        return Promise.reject('No tokens');
    }

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(tokens.accessToken),
    };

    const url = `${publicRuntimeConfig.baseApiUrl}/user/me`;

    const response = await fetch(url, requestOptions);
    const baseUrl = `${publicRuntimeConfig.baseApiUrl}/user/refresh-access-token`;

    return fetchHelper
        .handleResponse(response)
        .then((response) => {
            return response;
        })
        .catch((err) => {
            if (err === "Token d'access invalide ou expiré") {
                console.log('==== baseUrl ==== ', baseUrl);

                userService
                    .refreshAccessToken(tokens.refreshToken, baseUrl)
                    .then(async ({ data }) => {
                        const resp = await fetch(url, {
                            ...requestOptions,
                            body: JSON.stringify(data.accessToken),
                        });

                        return fetchHelper
                            .handleResponse(resp)
                            .then(async ({ data }) => {
                                return data;
                            })
                            .catch((err) => {
                                return Promise.reject(err);
                            });
                    })
                    .catch((err) => {
                        console.log('==== refreshAccessToken url ==== ', url);

                        return Promise.reject(err);
                    });
            }
        });
}

async function signOut() {
    Cookies.remove('tokens');

    return 'Tokens removed';
}

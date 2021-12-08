import jsCookie from 'js-cookie';
import getConfig from 'next/config';
import { fetchHelper } from '../helpers/fetch';

const { publicRuntimeConfig } = getConfig();

export const userService = {
    signup,
    activate,
    me,
    signIn,
    renewalCode,
    logout,
    refreshAccessToken,
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
                jsCookie.set('tokens', JSON.stringify(data));
            }

            
return response;
        })
        .catch((err) => {
            return Promise.reject(err);
        });
}

async function signIn(userData) {
    // TODO Tidy options
    const url = `${publicRuntimeConfig.baseApiUrl}/user/signin`;

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
                jsCookie.set('tokens', JSON.stringify(data));
            }

            
return response;
        })
        .catch((err) => {
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

async function refreshAccessToken() {
    const url = `${publicRuntimeConfig.baseApiUrl}/user/refresh-access-token`;

    const tokens = JSON.parse(jsCookie.get('tokens'));
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            refreshToken: tokens.refreshToken,
        }),
        credentials: 'include',
    });

    return fetchHelper
        .handleResponse(response)
        .then(({ response, data }) => {
            if (response.status >= 200 && response.status < 400) {
                console.log('==== Tokens updated ==== ', data);
                jsCookie.set('tokens', JSON.stringify(data));
            }

            return { response, data };
        })
        .catch((err) => {
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

async function me() {
    const url = `${publicRuntimeConfig.baseApiUrl}/user/me`;

    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
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

function logout() {
    // remove user from local storage, publish null to user subscribers and redirect to login page
    // localStorage.removeItem('user');
    // userSubject.next(null);
    // Router.push('/login');
}

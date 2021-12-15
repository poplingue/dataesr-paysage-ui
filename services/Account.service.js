import Cookies from 'js-cookie';
import getConfig from 'next/config';
import { fetchHelper } from '../helpers/fetch';

import { inactiveUserError } from '../helpers/internalMessages';

export const accountService = {
    me,
};

async function me(cookieTokens) {
    const tokens = cookieTokens || Cookies.get('tokens') || {};

    if ((tokens && !Object.keys(tokens).length) || !tokens) {
        return Promise.reject('No tokens');
    }

    // TODO refacto options
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tokens.accessToken),
        credentials: 'include',
    };

    const { publicRuntimeConfig } = getConfig();
    const meUrl = `${publicRuntimeConfig.baseApiUrl}/user/me`;
    const tokenUrl = `${publicRuntimeConfig.baseApiUrl}/auth/refresh-access-token`;

    const response = await fetch(meUrl, requestOptions);

    return fetchHelper
        .handleResponse(response)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((err) => {
            // TODO still useful??
            if (err === inactiveUserError) {
                return Promise.reject(err);
            }

            return authService
                .refreshAccessToken(tokens.refreshToken, tokenUrl)
                .then(async ({ data }) => {
                    const resp = await fetch(meUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data.accessToken),
                    });

                    return Promise.resolve(
                        fetchHelper
                            .handleResponse(resp)
                            .then(async (data) => {
                                return Promise.resolve(data);
                            })
                            .catch((err) => {
                                return Promise.reject(err);
                            })
                    );
                })
                .catch((err) => {
                    return Promise.reject(err);
                });
        });
}

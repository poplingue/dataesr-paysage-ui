import getConfig from 'next/config';
import { parseCookies } from 'nookies';
import { fetchHelper } from '../helpers/fetch';

import { inactiveUserError, noTokensError } from '../helpers/internalMessages';
import authService from './Auth.service';

export const accountService = {
    me: async (cookieTokens) => {
        const cookies = parseCookies();
        const tokens =
            cookieTokens ||
            (cookies.tokens && JSON.parse(cookies.tokens)) ||
            {};

        if ((tokens && !Object.keys(tokens).length) || !tokens) {
            return Promise.reject(noTokensError);
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
        let newTokens = '';

        const response = await fetch(meUrl, requestOptions);

        return fetchHelper
            .handleResponse(response)
            .then(({ data }) => {
                return Promise.resolve({ user: data });
            })
            .catch((err) => {
                // TODO still useful??
                if (err === inactiveUserError) {
                    return Promise.reject(err);
                }

                return authService
                    .refreshAccessToken(tokens.refreshToken, tokenUrl)
                    .then(async ({ data }) => {
                        newTokens = data;

                        const resp = await fetch(meUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data.accessToken),
                        });

                        return Promise.resolve(
                            fetchHelper
                                .handleResponse(resp)
                                .then(async ({ data }) => {
                                    return Promise.resolve({
                                        user: data,
                                        newTokens,
                                    });
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
    },
};

export default accountService;

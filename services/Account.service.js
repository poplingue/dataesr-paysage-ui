import getConfig from 'next/config';
import { fetchHelper } from '../helpers/fetch';

import {
    inactiveUserError,
    noTokensError,
    tokenError,
} from '../helpers/internalMessages';
import authService from './Auth.service';

export const accountService = {
    me: async (tokens) => {
        if (tokens && !Object.keys(tokens).length) {
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
            .then((response) => {
                return Promise.resolve(response);
            })
            .catch((err) => {
                // TODO still useful??
                if (err === inactiveUserError) {
                    return Promise.reject(err);
                }

                if (err === tokenError) {
                    authService
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
                        });
                }
            });
    },
};

export default accountService;

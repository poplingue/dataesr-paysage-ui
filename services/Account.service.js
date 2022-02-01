import getConfig from 'next/config';
import { fetchHelper } from '../helpers/fetch';

import {
    inactiveUserError,
    noTokensError,
    invalidToken,
} from '../helpers/internalMessages';
import authService from './Auth.service';

export const accountService = {
    me: async () => {
        const requestOptions = fetchHelper.requestOptions('POST');

        const { publicRuntimeConfig } = getConfig();
        const meUrl = `${publicRuntimeConfig.baseApiUrl}/user/me`;
        const tokenUrl = `${publicRuntimeConfig.baseApiUrl}/auth/refresh-access-token`;

        const response = await fetch(meUrl, requestOptions);

        return fetchHelper
            .handleResponse(response)
            .then(({ data }) => {
                return Promise.resolve(data);
            })
            .catch((err) => {
                if (err === inactiveUserError || err === noTokensError) {
                    return Promise.reject(err);
                }

                if (err === invalidToken) {
                    authService.refreshAccessToken(tokenUrl).then(async () => {
                        const resp = await fetch(meUrl, requestOptions);

                        return Promise.resolve(
                            fetchHelper
                                .handleResponse(resp)
                                .then(async ({ data }) => {
                                    return Promise.resolve({
                                        user: data,
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

import cookie from 'cookie';
import { genericErrorMsg, invalidToken } from './internalMessages';

export const fetchHelper = {
    setCookieTokens: (res, tokens, maxAge = 60 * 60) => {
        res.setHeader(
            'Set-Cookie',
            cookie.serialize('tokens', JSON.stringify(tokens), {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                maxAge,
                sameSite: 'strict',
                path: '/',
            })
        );
    },
    authHeader: (tokens) => {
        let headers = {};

        if (tokens) {
            headers = {
                Authorization: `Bearer ${tokens.accessToken}`,
            };
        }

        return headers;
    },

    handleJsons: (jsonResponses) => {
        let merged = [];

        for (let i = 0; i < jsonResponses.length; i++) {
            const {
                data: { data },
                response,
            } = jsonResponses[i];
            const length = response.url.split('/').length - 1;
            const subObject = response.url.split('/')[length];

            if (response.status >= 200 && response.status < 400) {
                merged.push({ data, subObject });
            }
        }

        return merged;
    },

    handleResponse: async (response) => {
        return response
            .clone()
            .text()
            .then((text) => {
                let data;

                try {
                    data = text && JSON.parse(text);
                } catch (strError) {
                    return Promise.reject(text || strError);
                }

                if (!response.ok) {
                    let errorMsg = data.message || genericErrorMsg;

                    if (!!Object.keys(data).length) {
                        errorMsg = data.error || genericErrorMsg;

                        if (data.details && !!data.details.length) {
                            errorMsg = data.details[0].message;
                        }
                    }

                    return Promise.reject(errorMsg);
                }

                return Promise.resolve({ response, data });
            });
    },
    requestOptions: (method, body, tokens, opts = {}) => {
        let options = {
            method,
            headers: { 'Content-Type': 'application/json' },
            ...opts,
        };

        if (body) {
            options = { ...options, body: JSON.stringify(body) };
        }

        if (tokens) {
            options = {
                ...options,
                credentials: 'include',
                headers: {
                    ...options.headers,
                    ...fetchHelper.authHeader(tokens),
                },
            };
        }

        return options;
    },
    headerTokens: (req, noError = false) => {
        let cookiesHeader = '';
        let tokens = null;

        if (req && req.headers && req.headers.cookie) {
            cookiesHeader = cookie.parse(req.headers.cookie);
        }

        if (!cookiesHeader && !noError) {
            throw Error('Cookie missing');
        } else if (Object.keys(cookiesHeader).includes('tokens')) {
            tokens = JSON.parse(cookiesHeader.tokens);
        }

        return tokens;
    },
    checkAuthorized: (tokens, request, res) => {
        if (
            tokens &&
            request.status === 401 &&
            request.statusText === 'Unauthorized'
        ) {
            res.status(401).send(invalidToken);
        }
    },
};

import { genericErrorMsg } from './internalMessages';

export const fetchHelper = {
    authHeader,
    handleResponse,
    requestOptions,
};

function authHeader(tokens) {
    let headers = {};

    if (tokens) {
        headers = {
            Authorization: `Bearer ${tokens.accessToken}`,
        };
    }

    return headers;
}

async function handleResponse(response) {
    return response
        .clone()
        .text()
        .then((text) => {
            let data;

            try {
                data = text && JSON.parse(text);
            } catch (strError) {
                return Promise.reject(strError || text);
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
}

function requestOptions(method, body, tokens, opts = {}) {
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
}

import { genericErrorMsg } from './internalMessages';

export const fetchHelper = {
    authHeader,
    handleResponse,
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
    return response.text().then((text) => {
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

                if (!!data.details.length) {
                    errorMsg = data.details[0].message;
                }
            }

            if ([401, 403].includes(response.status)) {
                // TODO Add signOut
                // userService.signOut();
            }

            return Promise.reject(errorMsg);
        }

        return Promise.resolve({ response, data });
    });
}

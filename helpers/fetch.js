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
            return Promise.reject(strError);
        }

        if (!response.ok) {
            let errorMsg =
                (!!Object.keys(data).length && data.error) ||
                response.statusText;

            // TODO Check user tokens exist

            if ([401, 403].includes(response.status)) {
                // TODO Add logout
                // userService.logout();
            }

            if (!!Object.keys(data).length && !!data.details.length) {
                errorMsg = data.details[0].message;
            }

            return Promise.reject(errorMsg);
        }

        return { response, data };
    });
}

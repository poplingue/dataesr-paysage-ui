import cookie from 'cookie';
import getConfig from 'next/config';
import { structureSubObjects } from '../../../helpers/constants';
import { fetchHelper } from '../../../helpers/fetch';
import { tokenError } from '../../../helpers/internalMessages';

const { serverRuntimeConfig } = getConfig();

async function handler(req, res) {
    // TODO refacto cookieHeaders
    let cookiesHeader = '';
    let tokens = null;

    if (req && req.headers && req.headers.cookie) {
        cookiesHeader = cookie.parse(req.headers.cookie);
    }

    if (!cookiesHeader) {
        throw Error('Cookie missing');
    } else if (Object.keys(cookiesHeader).includes('tokens')) {
        tokens = JSON.parse(cookiesHeader.tokens);
    }

    try {
        const url = `${serverRuntimeConfig.dataesrApiUrl}/structures`;
        const requestOptions = fetchHelper.requestOptions(
            'POST',
            req.body,
            tokens
        );

        const request = await fetch(url, requestOptions);

        // TODO handle response in a service/helper
        if (
            tokens &&
            request.status === 401 &&
            request.statusText === 'Unauthorized'
        ) {
            res.status(401).send(tokenError);
        }

        const response = await request.text();
        const { id } = JSON.parse(response);

        // Create all init objects of the structure
        let promises = [];

        for (let i = 0; i < structureSubObjects.length; i++) {
            const url = `${serverRuntimeConfig.dataesrApiUrl}/structures/${id}/${structureSubObjects[i].subObject}`;
            const requestOptions = fetchHelper.requestOptions(
                'POST',
                structureSubObjects[i].initBody,
                tokens
            );

            promises.push(fetch(url, requestOptions));
        }

        Promise.all(promises)
            .then((resp) => {
                res.status(request.status).json(response);
            })
            .catch((error) => {
                console.log('Error' + error);
                res.status(500).send(error);
            });
    } catch (err) {
        console.log('==== ERROR ==== ', err);
        res.status(500).send(err);
    }
}

export default handler;

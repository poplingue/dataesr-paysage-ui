import getConfig from 'next/config';
import { subObjects } from '../../../config/objects';
import { getObjectTypeDetails } from '../../../config/utils';
import { fetchHelper } from '../../../helpers/fetch';

const { serverRuntimeConfig } = getConfig();

async function handler(req, res) {
    const tokens = fetchHelper.headerTokens(req);

    const { object } = req.query;

    try {
        const url = `${serverRuntimeConfig.dataesrApiUrl}/${
            getObjectTypeDetails('', object).dataesrApi
        }`;
        const requestOptions = fetchHelper.requestOptions(
            'POST',
            req.body,
            tokens
        );

        const request = await fetch(url, requestOptions);

        fetchHelper.checkAuthorized(tokens, request, res);

        const response = await request.text();

        const { id } = JSON.parse(response);

        // Create all init objects of the structure
        let promises = [];
        const currentSubObjects = subObjects[object];

        for (let i = 0; i < currentSubObjects.length; i++) {
            const url = `${serverRuntimeConfig.dataesrApiUrl}/${
                getObjectTypeDetails('', object).dataesrApi
            }/${id}/${currentSubObjects[i].subObject}`;

            const requestOptions = fetchHelper.requestOptions(
                'POST',
                currentSubObjects[i].initBody,
                tokens
            );

            let request = new Request(url, requestOptions);
            promises.push(request);
        }

        // TODO add Promise.allSettled()
        return Promise.allSettled(
            promises.map((request) => {
                return fetch(request)
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => data);
            })
        )
            .then((values) => {
                res.status(request.status).json({
                    object: JSON.parse(response),
                    subObjects: values,
                });
            })
            .catch((error) => {
                res.status(500).send(error);
            });
    } catch (err) {
        res.status(500).send(err);
    }
}

export default handler;

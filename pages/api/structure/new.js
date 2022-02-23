import getConfig from 'next/config';
import { structureSubObjects } from '../../../helpers/constants';
import { fetchHelper } from '../../../helpers/fetch';

const { serverRuntimeConfig } = getConfig();

async function handler(req, res) {
    const tokens = fetchHelper.headerTokens(req);

    try {
        const url = `${serverRuntimeConfig.dataesrApiUrl}/structures`;
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

        for (let i = 0; i < structureSubObjects.length; i++) {
            const url = `${serverRuntimeConfig.dataesrApiUrl}/structures/${id}/${structureSubObjects[i].subObject}`;
            const requestOptions = fetchHelper.requestOptions(
                'POST',
                structureSubObjects[i].initBody,
                tokens
            );

            let request = new Request(url, requestOptions);

            promises.push(request);
        }

        // TODO add Promise.allSettled()
        return Promise.all(
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

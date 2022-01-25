import nc from 'next-connect';
import getConfig from 'next/config';
import { fetchHelper } from '../../../../helpers/fetch';

const { serverRuntimeConfig } = getConfig();

const handler = nc()
    .get(async (req, res) => {
        const tokens = fetchHelper.headerTokens(req);

        try {
            const url = `${serverRuntimeConfig.dataesrApiUrl}/structures/${req.query.id}/names`;
            const requestOptions = fetchHelper.requestOptions(
                'GET',
                null,
                tokens
            );

            const request = await fetch(url, requestOptions);

            fetchHelper.checkAuthorized(tokens, request, res);

            const response = await request.text();
            res.status(request.status).json(response);
        } catch (err) {
            res.status(500).send(err);
        }
    })
    .patch(async (req, res) => {
        const tokens = fetchHelper.headerTokens(req);

        try {
            const url = `${serverRuntimeConfig.dataesrApiUrl}/structures/${req.query.id}/names/1`;
            const requestOptions = fetchHelper.requestOptions(
                'PATCH',
                req.body,
                tokens
            );

            const request = await fetch(url, requestOptions);

            fetchHelper.checkAuthorized(tokens, request, res);

            const response = await request.text();
            res.status(request.status).json(response);
        } catch (err) {
            res.status(500).send(err);
        }
    });

export default handler;

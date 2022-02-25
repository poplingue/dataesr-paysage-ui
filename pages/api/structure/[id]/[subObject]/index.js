import nc from 'next-connect';
import getConfig from 'next/config';
import { structureSubObjects } from '../../../../../helpers/constants';
import { fetchHelper } from '../../../../../helpers/fetch';

const { serverRuntimeConfig } = getConfig();

const handler = nc()
    .post(async (req, res) => {
        const { subObject, id } = req.query;
        const tokens = fetchHelper.headerTokens(req);

        const subObjectInit = structureSubObjects.find((elm) => {
            return elm.subObject === subObject;
        });

        try {
            const url = `${serverRuntimeConfig.dataesrApiUrl}/structures/${id}/${subObject}`;

            const requestOptions = fetchHelper.requestOptions(
                'POST',
                subObjectInit.initBody,
                tokens
            );

            const request = await fetch(url, requestOptions);

            fetchHelper.checkAuthorized(tokens, request, res);

            const response = await request.text();
            console.log('==== POST ==== ', response);

            res.status(request.status).json(response);
        } catch (err) {
            res.status(500).send(err);
        }
    })
    .get(async (req, res) => {
        const tokens = fetchHelper.headerTokens(req);

        try {
            const url = `${serverRuntimeConfig.dataesrApiUrl}/structures/${req.query.id}/${req.query.subObject}`;
            const requestOptions = fetchHelper.requestOptions(
                'GET',
                null,
                tokens
            );

            const request = await fetch(url, requestOptions);

            fetchHelper.checkAuthorized(tokens, request, res);

            const response = await request.json();
            console.log('==== LOG ==== ', response);

            res.status(request.status).send(response);
        } catch (err) {
            res.status(500).send(err);
        }
    });

export default handler;

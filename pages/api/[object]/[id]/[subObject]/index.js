import nc from 'next-connect';
import getConfig from 'next/config';
import { subObjects } from '../../../../../config/objects';
import { getObjectTypeDetails } from '../../../../../config/utils';
import { fetchHelper } from '../../../../../helpers/fetch';

const { serverRuntimeConfig } = getConfig();

const handler = nc()
    .post(async (req, res) => {
        const { object, subObject, id } = req.query;
        const tokens = fetchHelper.headerTokens(req);

        const subObjectInit = subObjects[object].find(
            (elm) => elm.subObject === subObject
        );

        try {
            const url = `${serverRuntimeConfig.dataesrApiUrl}/${
                getObjectTypeDetails('', object).dataesrApi
            }/${id}/${subObject}`;

            const requestOptions = fetchHelper.requestOptions(
                'POST',
                subObjectInit.initBody,
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
    .get(async (req, res) => {
        const tokens = fetchHelper.headerTokens(req);
        const { object, subObject } = req.query;

        try {
            const url = `${serverRuntimeConfig.dataesrApiUrl}/${
                getObjectTypeDetails('', object).dataesrApi
            }/${req.query.id}/${subObject}`;

            const requestOptions = fetchHelper.requestOptions(
                'GET',
                null,
                tokens
            );

            const request = await fetch(url, requestOptions);

            fetchHelper.checkAuthorized(tokens, request, res);

            const response = await request.json();

            res.status(request.status).send(response);
        } catch (err) {
            res.status(500).send(err);
        }
    });

export default handler;

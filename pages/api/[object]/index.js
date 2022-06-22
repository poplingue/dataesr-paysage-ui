import nc from 'next-connect';
import getConfig from 'next/config';
import { getObjectTypeDetails } from '../../../config/utils';
import { fetchHelper } from '../../../helpers/fetch';

const { serverRuntimeConfig } = getConfig();

const handler = nc()
    .get(async (req, res) => {
        const tokens = fetchHelper.headerTokens(req);
        const { object } = req.query;
        const { dataesrApi } = getObjectTypeDetails('', object);

        try {
            const url = `${serverRuntimeConfig.dataesrApiUrl}/${dataesrApi}`;

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
    .post(async (req, res) => {
        console.log('POST');
        console.log(req.body);
        const { object } = req.query;
        const { dataesrApi } = getObjectTypeDetails('', object);
        const tokens = fetchHelper.headerTokens(req);
        // console.log(object, dataesrApi, body, tokens);

        // // const subObjectInit = subObjects[object].find(
        // //     (elm) => elm.subObject === subObject
        // // );

        try {
            const url = `${serverRuntimeConfig.dataesrApiUrl}/${dataesrApi}`;

            const requestOptions = fetchHelper.requestOptionsFormData(
                'POST',
                req.body,
                tokens
            );
            console.log('requestOptions =>', requestOptions);
            const request = await fetch(url, requestOptions);

            //     fetchHelper.checkAuthorized(tokens, request, res);

            const response = await request.text();
            console.log(response);
            res.status(request.status).json(response);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    });

export default handler;

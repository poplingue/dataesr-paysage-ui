import { getUrl } from '../../../config/utils';
import { fetchHelper } from '../../../helpers/fetch';

async function handler(req, res) {
    try {
        const { q, validatorId } = req.query;

        const url = `${getUrl(validatorId)}&q=${q}`;

        const requestOptions = fetchHelper.requestOptions('GET');

        const request = await fetch(url, requestOptions);

        const response = await request.text();

        res.status(request.status).json(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

export default handler;

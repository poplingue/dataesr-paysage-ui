import { getUrl } from '../../../config/utils';
import { fetchHelper } from '../../../helpers/fetch';

async function handler(req, res) {
    try {
        const { validatorId } = req.query;
        const clauses = Object.keys(req.body);

        let queryString = '';

        for (let i = 0; i < clauses.length; i = i + 1) {
            queryString += `&${clauses[i]}=${req.body[clauses[i]]}`;
        }

        const url = `${getUrl(validatorId)}${queryString}`;

        const requestOptions = fetchHelper.requestOptions('GET');

        const request = await fetch(url, requestOptions);

        const response = await request.text();

        res.status(request.status).json(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

export default handler;

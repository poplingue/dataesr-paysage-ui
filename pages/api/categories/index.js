import axios from 'axios';
import { fetchHelper } from '../../../helpers/fetch';

async function apiPost(url, accessToken, data) {
    const headers = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    };

    try {
        const response = await axios.post(url, data, headers);

        return response;
    } catch (err) {
        throw err;
    }
}

const fn = async (req, res) => {
    switch (req.method) {
        case 'POST':
            const url = 'https://api.paysage.staging.dataesr.ovh/categories';
            const { accessToken } = fetchHelper.headerTokens(req);
            console.log('data', req.body.data);

            try {
                const response = await apiPost(url, accessToken, req.body.data);
                console.log(response.data);
                res.status(response.status).json({ data: response.data });
            } catch (error) {
                console.log(error);
                res.status(500).json({ data: 'categories patch error!' });
            }

            break;

        case 'GET': // get all categories
            res.status(200).json({ data: 'envoi des données sur GET' });

            break;

        default:
            res.status(200).json({ data: 'it works!' });
    }
};

export default fn;

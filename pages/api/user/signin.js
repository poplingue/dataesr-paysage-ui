async function handler(req, res) {
    try {
        // TODO Tidy options
        const request = await fetch(
            'https://api.paysage.staging.dataesr.ovh/auth/signin',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req.body),
            }
        );

        const response = await request.text();
        res.status(request.status).json(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

export default handler;

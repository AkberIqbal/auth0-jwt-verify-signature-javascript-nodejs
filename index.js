const jwt = require('jsonwebtoken');
const axios = require('axios');
var jose = require('node-jose');

const express = require('express');
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
});

const verifyJWT = async (token, verifyURL) => {

    return new Promise(async (resolve, reject) => {
        const result = jwt.decode(token, { complete: true });

        const domainFromToken = result?.payload?.iss;

        const signatureUrl = verifyURL ? verifyURL : `${domainFromToken}.well-known/jwks.json`;

        const jwksResponse = await axios.get(signatureUrl);

        const jwks = jwksResponse?.data?.keys;
        console.log('# of JWKS:', jwks.length, ' -trying to find:', result?.header?.kid);

        const relevantKey = jwks.filter(jk => jk.kid === result?.header?.kid);
        console.log('relevantKey:', relevantKey);

        let key = await jose.JWK.asKey(relevantKey[0]);

        const joseResult =
            await jose.JWS
                .createVerify(key)
                .verify(token)
                .catch(exp => {
                    console.log('exp:', exp);
                    reject(exp);
                });

        if (joseResult && Object.keys(joseResult).length > 0) {
            console.log('Object.keys(joseResult):', Object.keys(joseResult));
            // console.log('joseResult:', joseResult);
            resolve('ok');
        }
    })
}

app.get('/verify', async (req, res) => {
    const { headers, body } = req;

    const result = await verifyJWT(headers?.authorization, headers?.verifyurl)
        .catch(exp => {
            console.log('rejection !!!:', exp);
            res.send(`token/signature not verified: ${exp}`);
        });
    if (result) {
        console.log('token is verified');
        res.send('token & signature is verified');
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
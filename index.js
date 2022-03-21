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
        console.log('TODO: result:', result);

        // 1. Check the signing algorithm
        // const signingAlgorithm = result?.header?.alg;

        // 2. Confirm that the token is correctly signed using the proper key
        // A. Take the original Base64url-encoded Header and original Base64url-encoded Payload segments (Base64url-encoded Header + "." + Base64url-encoded Payload), and hash them with SHA-256.

        // const segments = token.split(".");
        // const base64urlEncodedHeader = segments[0];
        // const base64urlEncodedPayload = segments[1];
        // console.log('one (base64urlEncodedHeader):', base64urlEncodedHeader);
        // console.log('two (base64urlEncodedPayload):', base64urlEncodedPayload);

        // const digest = `${base64urlEncodedHeader}.${base64urlEncodedPayload}`;
        // console.log('digest:', digest);

        // const hashed = createHash('sha256').update(digest).digest('hex');
        // console.log('hashed:', hashed);

        const jwksResponse = await axios.get(verifyURL);

        const jwks = jwksResponse?.data?.keys;
        console.log('jwks:', jwks.length);
        console.log('trying to find:', result?.header?.kid);

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
            console.log('joseResult:', joseResult);
            console.log('Object.keys(joseResult):', Object.keys(joseResult));
            resolve('ok');
        }

    })
}

app.get('/verify', async (req, res) => {
    const { headers, body } = req;
    console.log('headers:', headers);
    console.log('body:', body);

    const result = await verifyJWT(headers?.authorization, headers?.verifyurl).catch(exp => {
        console.log('TODO: rejection !!!:', exp);
        res.send('got em all...');
        res.end();
    });
    if (result) {
        console.log('here 1 !!')
        res.send('got em all...');
    }
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
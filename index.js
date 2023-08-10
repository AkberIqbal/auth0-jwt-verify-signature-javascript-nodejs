const jwt = require('jsonwebtoken');
const axios = require('axios');
// var jose = require('node-jose');
const jose = require('jose');

const express = require('express');
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
});

/**
 * We verify RS256 signature for an Auth0 token - instead of the old HS256
 * for more info: check the readme
 * 
 * token    : the token that you got from Auth0 and you want to verify
 * verifyURL: your domain in Auth0, this is optional parameter now because we can get the domain ourselves
 */
const verifyJWT = async (token, verifyURL) => {

    return new Promise(async (resolve, reject) => {
        const result = jwt.decode(token, { complete: true });

        // DANGER: your server should have the domain of the authentication token...
        // if the token is from a bad-actor-authentication-server... we don't want to check it against it !!!
        // perhaps this could be a point of checking and exiting early if this domain is different to our domain
        const domainFromToken = result?.payload?.iss;

        const signatureUrl = verifyURL ? verifyURL : `${domainFromToken}.well-known/jwks.json`;

        const jwksResponse = await axios.get(signatureUrl).catch((exp)=>{
            console.log('Error getting jwkResponse:', exp);
            reject(false)
        });

        const jwks = jwksResponse?.data?.keys;
        console.log('# of JWKS:', jwks.length, ' -trying to find:', result?.header?.kid);

        const relevantKey = jwks.filter(jk => jk.kid === result?.header?.kid)[0];
        console.log('relevantKey:', relevantKey);

        const algoForImport = selectedKey.alg
        const publicKey = await jose.importJWK(relevantKey, algoForImport);

         const { payload, protectedHeader }  = await jose.jwtVerify(token, publicKey, {
                iss: 'issuer, get this from decoded token, or the issuer you expect',
            }).catch(exp => {
                console.log('exp:', exp);
                reject(exp);
            });

        if (payload && Object.keys(payload).length > 0) {
            console.log('Object.keys(payload):', Object.keys(payload));
            // uncomment to take a closer look
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

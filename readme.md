# verify RS256 signed JWT token / signature (nodeJS)

## Intent: Need to check if the (RS256) Auth0 token is legit
 - using `jsonwebtoken` npm package
 - we can do `jwt.decode` - but that wouldn't verify the signature
 - we can't simply do `jwt.verify` and have to jump through hoops (https://auth0.com/docs/secure/tokens/json-web-tokens/validate-json-web-tokens#check-signature)
 - this repo provides that simple mechanism

 ## YOU ONLY NEED THE TOKEN - nothing else to verify its signature

 ## curl for the call
`curl --location --request GET "http://localhost:3000/verify" \
--header "Authorization: ENTER-THE-BIG-RS256-TOKEN-THAT-YOU-WANT-TO-VRIFY-HERE" \

## RS256 (new better, asymetric)
RS256 (RSA Signature with SHA-256) is an asymmetric algorithm, and it uses a public/private key pair: the identity provider has a private (secret) key used to generate the signature, and the consumer of the JWT gets a public key to validate the signature. Since the public key, as opposed to the private key, doesn’t need to be kept secured, most identity providers make it easily available for consumers to obtain and use (usually through a metadata URL).
 
## HS256 (old which needed private key sharing)
HS256 (HMAC with SHA-256), on the other hand, is a symmetric algorithm, with only one (secret) key that is shared between the two parties. Since the same key is used both to generate the signature and to validate it, care must be taken to ensure that the key is not compromised.

## when to use which
If you will be developing the application consuming the JWTs, you can safely use HS256, because you will have control on who uses the secret keys. If, on the other hand, you don’t have control over the client, or you have no way of securing a secret key, RS256 will be a better fit, since the consumer only needs to know the public (shared) key.

ref: https://community.auth0.com/t/jwt-signing-algorithms-rs256-vs-hs256/7720

## resources: 
- https://stackoverflow.com/questions/70509112/how-to-verify-a-jwt-signature-using-node-jose
- https://www.npmjs.com/package/node-jose#keys-used-for-signing-and-verifying

### what to check: 
- https://auth0.com/blog/navigating-rs256-and-jwks/

### jsonwebtoken is not that helpful - not as much as node-jose anyways
Since you’re asking about jwt.decode, I assume you’re using node-jsonwebtoken 136. From the repository:
- jwt.decode:
    - (Synchronous) Returns the decoded payload without verifying if the signature is valid. Warning: This will not verify whether the signature is valid. You should not use this for untrusted messages. You most likely want to use jwt.verify instead. 

- jwt.verify:
    - (Asynchronous) If a callback is supplied, function acts asynchronously. The callback is called with the decoded payload if the signature is valid and optional expiration, audience, or issuer are valid. If not, it will be called with the error.
    - (Synchronous) If a callback is not supplied, function acts synchronously. Returns the payload decoded if the signature is valid and optional expiration, audience, or issuer are valid. If not, it will throw the error.

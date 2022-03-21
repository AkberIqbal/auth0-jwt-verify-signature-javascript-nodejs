## verify JWT signature (nodeJS)

### what to check: 
- https://auth0.com/blog/navigating-rs256-and-jwks/
- https://auth0.com/docs/secure/tokens/json-web-tokens/validate-json-web-tokens#check-signature

Since you’re asking about jwt.decode, I assume you’re using node-jsonwebtoken 136. From the repository:

### jsonwebtoken is not that helpful - not as much as node-jose anyways
- jwt.decode 254:
    - (Synchronous) Returns the decoded payload without verifying if the signature is valid. Warning: This will not verify whether the signature is valid. You should not use this for untrusted messages. You most likely want to use jwt.verify instead. 
 
- jwt.verify 283:
    - (Asynchronous) If a callback is supplied, function acts asynchronously. The callback is called with the decoded payload if the signature is valid and optional expiration, audience, or issuer are valid. If not, it will be called with the error.
    - (Synchronous) If a callback is not supplied, function acts synchronously. Returns the payload decoded if the signature is valid and optional expiration, audience, or issuer are valid. If not, it will throw the error.


## resources: 
- https://stackoverflow.com/questions/70509112/how-to-verify-a-jwt-signature-using-node-jose
- https://www.npmjs.com/package/node-jose#keys-used-for-signing-and-verifying
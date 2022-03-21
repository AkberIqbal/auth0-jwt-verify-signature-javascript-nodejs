# verify JWT signature (nodeJS)


## Intent: Need to check if the Auth0 token is legit on the backend
 - using jsonwebtoken npm package
 - we can do jwt.decode - but that wouldn't verify the signature
 - we can't simply do jwt.verify and have to jump through hoops (https://auth0.com/docs/secure/tokens/json-web-tokens/validate-json-web-tokens#check-signature)
 - this repo provides that simple mechanism

 ## YOU ONLY NEED THE TOKEN - nothing else to verify its signature

 ## curl for the call
`curl --location --request GET "http://localhost:3000/verify" \
--header "Authorization: ENTER-THE-BIG-RS256-TOKEN-THAT-YOU-WANT-TO-VRIFY-HERE" \

## resources: 
- https://stackoverflow.com/questions/70509112/how-to-verify-a-jwt-signature-using-node-jose
- https://www.npmjs.com/package/node-jose#keys-used-for-signing-and-verifying

### what to check: 
- https://auth0.com/blog/navigating-rs256-and-jwks/

### jsonwebtoken is not that helpful - not as much as node-jose anyways
Since you’re asking about jwt.decode, I assume you’re using node-jsonwebtoken 136. From the repository:
- jwt.decode 254:
    - (Synchronous) Returns the decoded payload without verifying if the signature is valid. Warning: This will not verify whether the signature is valid. You should not use this for untrusted messages. You most likely want to use jwt.verify instead. 
 
- jwt.verify 283:
    - (Asynchronous) If a callback is supplied, function acts asynchronously. The callback is called with the decoded payload if the signature is valid and optional expiration, audience, or issuer are valid. If not, it will be called with the error.
    - (Synchronous) If a callback is not supplied, function acts synchronously. Returns the payload decoded if the signature is valid and optional expiration, audience, or issuer are valid. If not, it will throw the error.



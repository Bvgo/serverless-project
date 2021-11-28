// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'tezzory3jl'
export const apiEndpoint = `https://${apiId}.execute-api.us-west-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-c77426bq.us.auth0.com', // Auth0 domain
  clientId: 'GkqssuDxd9pZSUCdo4UiCHl7Q3BEN5EX', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
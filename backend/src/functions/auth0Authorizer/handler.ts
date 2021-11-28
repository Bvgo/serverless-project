import {
  APIGatewayAuthorizerHandler,
  APIGatewayTokenAuthorizerEvent
} from 'aws-lambda';
import { verify, JwtPayload } from 'jsonwebtoken';
import { middyfy } from '@libs/lambda';
import axios from 'axios';
import { createLogger } from 'src/utils/logger';
import { getToken } from 'src/auth/utils';

const logger = createLogger('auth');

const auth0Authorizer: APIGatewayAuthorizerHandler = async (
  event: APIGatewayTokenAuthorizerEvent
) => {
  logger.info('Authenticating: ', { token: event.authorizationToken });
  try {
    const decoded = await verifyToken(event.authorizationToken);
    logger.info('Verified details', { user: decoded.sub });

    return {
      principalId: decoded.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    };
  } catch (e) {
    logger.info('User was not authorized ', e.message);

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    };
  }
};

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader);
  let cert: string;
  try {
    const response = await axios.get(
      'https://dev-c77426bq.us.auth0.com/.well-known/jwks.json'
    );

    // logger.info('axios call returns: ', { response });

    const pemData = response['data']['keys'][0]['x5c'][0];
    cert = `-----BEGIN CERTIFICATE-----\n${pemData}\n-----END CERTIFICATE-----`;
  } catch (err) {
    logger.info(err);
  }

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload;
}

export const main = middyfy(auth0Authorizer);

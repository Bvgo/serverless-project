import { decode } from 'jsonwebtoken'
export function getUserId(authHeader: string) {
  const jwtToken = getToken(authHeader)
  const decoded = decode(jwtToken)
  return decoded.sub
}

export function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

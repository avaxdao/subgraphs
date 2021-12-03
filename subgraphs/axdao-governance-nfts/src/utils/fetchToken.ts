import { BigInt } from '@graphprotocol/graph-ts'
import { Token } from '../../generated/schema'

export function fetchToken(tokenId: BigInt): Token {
  let token = Token.load(tokenId.toString())

  if (token === null) {
    token = new Token(tokenId.toString())
    token.save()
  }

  return token
}

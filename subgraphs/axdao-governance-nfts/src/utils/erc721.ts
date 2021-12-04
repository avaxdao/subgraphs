/* eslint-disable prefer-const */
import { Address, BigInt } from '@graphprotocol/graph-ts'
import { Contract, Token } from '../../generated/schema'
import { MutantAxApes } from '../../generated/MutantAxApes/MutantAxApes'
import { constants } from '@amxx/graphprotocol-utils'
import { fetchAccount } from './account'
import { Account } from '../../generated/schema'

export function fetchERC721(address: Address): Contract {
  let account = fetchAccount(address.toHex())
  let contract = Contract.load(account.id)

  if (contract == null) {
    let endpoint = MutantAxApes.bind(address)
    let name = endpoint.try_name()
    let symbol = endpoint.try_symbol()

    contract = new Contract(account.id)
    contract.asAccount = account.id
    contract.name = name.reverted ? null : name.value
    contract.symbol = symbol.reverted ? null : symbol.value
    contract.totalOwners = constants.BIGINT_ZERO
    contract.totalTokens = constants.BIGINT_ZERO
    contract.totalTransfers = constants.BIGINT_ZERO
    account.asContract = contract.id
    contract.save()
    account.save()
  }
  return contract as Contract
}

export function fetchToken(contract: Contract, identifier: BigInt, account: Account): Token {
  let id = contract.id.concat('-').concat(identifier.toHex())
  let token = Token.load(id)

  if (token == null) {
    token = new Token(id)
    token.contract = contract.id
    token.identifier = identifier
    token.minter = account.id
    token.owner = account.id
    token.totalTransfers = constants.BIGINT_ZERO

    let erc721 = MutantAxApes.bind(Address.fromString(contract.id))
    let try_tokenURI = erc721.try_tokenURI(identifier)
    token.uri = try_tokenURI.reverted ? '' : try_tokenURI.value
  }
  return token as Token
}

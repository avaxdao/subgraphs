/* eslint-disable prefer-const */
import { Address } from '@graphprotocol/graph-ts'
import { Transfer, Token } from '../generated/schema'
import {
  Transfer as TransferEvent,
  ApeMinted as ApeMintedEvent,
  // ApeMutated,
  // ApeNameUpdated,
  ReserveGiveaway as ReserveGiveawayEvent,
} from '../generated/MutantAxApes/MutantAxApes'
import { fetchTokenUri } from './utils'
import { fetchAccount } from './utils/fetchAccount'
import { fetchContract } from './utils/fetchContract'
import { fetchToken } from './utils/fetchToken'
import { constants } from './utils/constants'

export function handleTransfer(event: TransferEvent): void {
  // Contract
  let contract = fetchContract(Address.fromString(constants.MUTANT_AX_APES_ADDRESS))
  let from = fetchAccount(event.params.from)
  let to = fetchAccount(event.params.to)

  contract.totalTransfers = contract.totalTransfers.plus(constants.BIGINT_ONE)
  contract.save()

  if (
    event.params.from.notEqual(Address.fromString(constants.PROFILE_ADDRESS)) &&
    event.params.to.notEqual(Address.fromString(constants.PROFILE_ADDRESS))
  ) {
    // To
    to.totalTokens = to.totalTokens.plus(constants.BIGINT_ONE)
    to.totalTransfers = to.totalTransfers.plus(constants.BIGINT_ONE)
    to.save()

    // From
    from.totalTokens = event.params.from.equals(Address.fromString(constants.ADDRESS_ZERO))
      ? from.totalTokens
      : from.totalTokens.minus(constants.BIGINT_ONE)
    from.totalTransfers = from.totalTransfers.plus(constants.BIGINT_ONE)
    from.save()

    if (event.params.from.notEqual(Address.fromString(constants.ADDRESS_ZERO))) {
      // Token
      let token = fetchToken(event.params.tokenId)
      token.owner = to.id
      token.totalTransfers = token.totalTransfers.plus(constants.BIGINT_ONE)
      token.updatedAt = event.block.timestamp
      token.save()
    }
  }

  // Transfer
  let transfer = new Transfer(event.transaction.hash.toHex())
  transfer.hash = event.transaction.hash
  transfer.from = from.id
  transfer.to = to.id
  transfer.token = event.params.tokenId.toString()
  transfer.timestamp = event.block.timestamp
  transfer.save()
}

export function handleReserveGiveaway(event: ReserveGiveawayEvent): void {
  // From
  let from = fetchAccount(Address.fromString(constants.RESERVE_ADDRESS))
  from.totalTokensMinted = from.totalTokensMinted.minus(constants.BIGINT_ONE)
  from.save()

  // To
  let to = fetchAccount(event.params.winner)
  to.totalTokensMinted = to.totalTokensMinted.plus(constants.BIGINT_ONE)
  to.save()

  // Token
  let token = fetchToken(event.params.apeId)
  token.minter = to.id
  token.save()
}

export function handleApeMinted(event: ApeMintedEvent): void {
  let token = new Token(event.params.apeId.toString())
  let to = fetchAccount(event.params.minter)
  let contract = fetchContract(Address.fromString(constants.MUTANT_AX_APES_ADDRESS))

  token.minter = event.params.minter.toString()
  token.owner = event.params.minter.toString()
  token.uri = fetchTokenUri(event.params.apeId)
  token.totalTransfers = constants.BIGINT_ZERO
  token.block = event.block.number
  token.createdAt = event.block.timestamp
  token.updatedAt = event.block.timestamp
  token.save()

  contract.totalTokens = contract.totalTokens.plus(constants.BIGINT_ONE)
  contract.save()

  to.totalTokensMinted = to.totalTokensMinted.plus(constants.BIGINT_ONE)
  to.save()
}

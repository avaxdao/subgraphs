/* eslint-disable prefer-const */
import { Transfer } from '../generated/schema'
import {
  Transfer as TransferEvent,
  ApeMinted as ApeMintedEvent,
  // ApeMutated,
  // ApeNameUpdated,
  ReserveGiveaway as ReserveGiveawayEvent,
} from '../generated/MutantAxApes/MutantAxApes'
import { fetchAccount } from './utils/account'
import { fetchERC721, fetchToken } from './utils/erc721'
import { constants, events, transactions } from '@amxx/graphprotocol-utils'

let PROFILE_ADDRESS = '0x654de7fcfaa4ab8aea260c04fd47078434a49d01'
let RESERVE_ADDRESS = '0xD337Ad1E01861eD8e039FC4927803B1462421a12'

export function handleTransfer(event: TransferEvent): void {
  if (event.params.from.toHex() != PROFILE_ADDRESS && event.params.to.toHex() != PROFILE_ADDRESS) {
    let contract = fetchERC721(event.address)
    let transfer = new Transfer(events.id(event))

    let from = fetchAccount(event.params.from.toHex())
    let to = fetchAccount(event.params.to.toHex())
    let token = fetchToken(contract, event.params.tokenId, to)

    contract.totalTransfers = contract.totalTransfers.plus(constants.BIGINT_ONE)
    token.totalTransfers = token.totalTransfers.plus(constants.BIGINT_ONE)
    token.owner = to.id

    if (from.id != constants.ADDRESS_ZERO) {
      from.totalTokens = from.totalTokens.minus(constants.BIGINT_ONE)

      if (from.totalTokens == constants.BIGINT_ZERO) {
        contract.totalOwners = contract.totalOwners.minus(constants.BIGINT_ONE)
      }
    }

    if (to.id != constants.ADDRESS_ZERO) {
      to.totalTokens = to.totalTokens.plus(constants.BIGINT_ONE)

      if (to.totalTokens == constants.BIGINT_ONE) {
        contract.totalOwners = contract.totalOwners.plus(constants.BIGINT_ONE)
      }
    }

    transfer.emitter = contract.id
    transfer.transaction = transactions.log(event).id
    transfer.timestamp = event.block.timestamp
    transfer.contract = contract.id
    transfer.token = token.id
    transfer.from = from.id
    transfer.to = to.id

    from.save()
    to.save()
    contract.save()
    token.save()
    transfer.save()
  }
}

export function handleReserveGiveaway(event: ReserveGiveawayEvent): void {
  let contract = fetchERC721(event.address)
  let from = fetchAccount(RESERVE_ADDRESS)
  let to = fetchAccount(event.params.winner.toHex())
  let token = fetchToken(contract, event.params.apeId, to)

  from.totalTokensMinted = from.totalTokensMinted.minus(constants.BIGINT_ONE)
  to.totalTokensMinted = to.totalTokensMinted.plus(constants.BIGINT_ONE)
  token.minter = to.id

  token.save()
  from.save()
  to.save()
}

export function handleApeMinted(event: ApeMintedEvent): void {
  let contract = fetchERC721(event.address)
  let to = fetchAccount(event.params.minter.toHex())
  let token = fetchToken(contract, event.params.apeId, to)

  token.minter = to.id
  token.createdAt = event.block.timestamp
  contract.totalTokens = contract.totalTokens.plus(constants.BIGINT_ONE)
  to.totalTokensMinted = to.totalTokensMinted.plus(constants.BIGINT_ONE)

  contract.save()
  token.save()
  to.save()
}

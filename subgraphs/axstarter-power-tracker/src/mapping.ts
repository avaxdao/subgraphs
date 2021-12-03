/* eslint-disable prefer-const */
import { Transfer } from '../generated/schema'
import { Transfer as TransferEvent } from '../generated/erc20/IERC20'
import { constants, decimals, events, transactions } from '@amxx/graphprotocol-utils'
import { fetchAccount } from './utils/account'
import { fetchERC20, fetchBalance } from './utils/erc20'

export function handleTransfer(event: TransferEvent): void {
  let contract = fetchERC20(event.address)
  let transfer = new Transfer(events.id(event))

  let from = fetchAccount(event.params.from.toHex())
  let fromBalance = fetchBalance(contract, from)

  let to = fetchAccount(event.params.to.toHex())
  let toBalance = fetchBalance(contract, to)

  transfer.type = 'Transfer'

  // if from the zero address add to balance as tokens have been minted
  if (from.id == constants.ADDRESS_ZERO) {
    fromBalance.value = fromBalance.value.plus(decimals.toDecimals(event.params.value, contract.decimals))
    transfer.type = 'Mint'
  } else {
    fromBalance.value = fromBalance.value.minus(decimals.toDecimals(event.params.value, contract.decimals))

    transfer.from = from.id
    transfer.fromBalance = fromBalance.id
  }

  // if to the zero address minus from balance as tokens have been burned
  if (to.id == constants.ADDRESS_ZERO) {
    toBalance.value = toBalance.value.minus(decimals.toDecimals(event.params.value, contract.decimals))
    toBalance.burnValue = toBalance.burnValue.plus(decimals.toDecimals(event.params.value, contract.decimals))

    fromBalance.burnValue = fromBalance.burnValue.plus(decimals.toDecimals(event.params.value, contract.decimals))
    transfer.type = 'Burn'
  } else {
    toBalance.value = toBalance.value.plus(decimals.toDecimals(event.params.value, contract.decimals))

    if (toBalance.value > toBalance.greatestValue) {
      toBalance.greatestValue = toBalance.value
    }

    transfer.to = to.id
    transfer.toBalance = toBalance.id
  }

  transfer.emitter = contract.id
  transfer.transaction = transactions.log(event).id
  transfer.timestamp = event.block.timestamp
  transfer.contract = contract.id
  transfer.value = decimals.toDecimals(event.params.value, contract.decimals)

  fromBalance.save()
  toBalance.save()
  transfer.save()
}

/* eslint-disable prefer-const */
import { Address } from '@graphprotocol/graph-ts'
import { Account } from '../../generated/schema'
import { constants } from './constants'
import { fetchContract } from './fetchContract'

export function fetchAccount(address: Address): Account {
  let account = Account.load(address.toHex())

  if (account === null) {
    account = new Account(address.toHex())
    account.totalTokens = constants.BIGINT_ZERO
    account.totalTokensMinted = constants.BIGINT_ZERO
    account.totalTransfers = constants.BIGINT_ZERO
    account.save()

    let contract = fetchContract(Address.fromString(constants.MUTANT_AX_APES_ADDRESS))
    contract.totalOwners = contract.totalOwners.plus(constants.BIGINT_ONE)
    contract.save()
  }

  return account
}

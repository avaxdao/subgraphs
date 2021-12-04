/* eslint-disable prefer-const */
import { constants } from '@amxx/graphprotocol-utils'
import { Account } from '../../generated/schema'

export function fetchAccount(address: string): Account {
  let account = Account.load(address)

  if (account == null) {
    account = new Account(address)
    account.totalTokens = constants.BIGINT_ZERO
    account.totalTokensMinted = constants.BIGINT_ZERO
  }
  account.save()

  return account
}

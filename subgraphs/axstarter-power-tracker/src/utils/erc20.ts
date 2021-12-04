/* eslint-disable prefer-const */
import { Address } from '@graphprotocol/graph-ts'
import { constants } from '@amxx/graphprotocol-utils'
import { Account, Contract, Balance } from '../../generated/schema'
import { IERC20 } from '../../generated/erc20/IERC20'
import { fetchAccount } from './account'

export function fetchERC20(address: Address): Contract {
  let account = fetchAccount(address.toHex())
  let contract = Contract.load(account.id)

  if (contract == null) {
    let endpoint = IERC20.bind(address)
    let name = endpoint.try_name()
    let symbol = endpoint.try_symbol()
    let decimals = endpoint.try_decimals()

    contract = new Contract(account.id)
    contract.name = name.reverted ? null : name.value
    contract.symbol = symbol.reverted ? null : symbol.value
    contract.decimals = decimals.reverted ? 18 : decimals.value
    contract.totalSupply = fetchBalance(contract as Contract, null).id
    contract.asAccount = account.id
    account.asContract = contract.id
    contract.save()
    account.save()
  }
  return contract as Contract
}

export function fetchBalance(contract: Contract, account: Account | null): Balance {
  account = account ? (account.id == constants.ADDRESS_ZERO ? null : account) : null
  let id = contract.id.concat('-').concat(account ? account.id : 'totalSupply')
  let balance = Balance.load(id)

  if (balance == null) {
    balance = new Balance(id)
    balance.contract = contract.id
    balance.account = account ? account.id : null
    balance.value = constants.BIGDECIMAL_ZERO
    balance.burnValue = constants.BIGDECIMAL_ZERO
    balance.greatestValue = constants.BIGDECIMAL_ZERO
    balance.save()
  }

  return balance as Balance
}

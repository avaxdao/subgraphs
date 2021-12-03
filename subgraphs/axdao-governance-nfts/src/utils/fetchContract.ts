/* eslint-disable prefer-const */
import { Address } from '@graphprotocol/graph-ts'
import { Contract } from '../../generated/schema'
import { MutantAxApes } from '../../generated/MutantAxApes/MutantAxApes'
import { constants } from './constants'

export function fetchContract(address: Address): Contract {
  let contract = Contract.load(address.toHex())

  if (contract === null) {
    contract = new Contract(address.toHex())
    let mutants = MutantAxApes.bind(address)
    let try_name = mutants.try_name()
    let try_symbol = mutants.try_symbol()
    contract.name = try_name.reverted ? '' : try_name.value
    contract.symbol = try_symbol.reverted ? '' : try_symbol.value

    contract.totalTokens = constants.BIGINT_ZERO
    contract.totalOwners = constants.BIGINT_ZERO
    contract.totalTransfers = constants.BIGINT_ZERO

    contract.save()
  }

  return contract
}

/* eslint-disable prefer-const */
import { BigInt, dataSource } from '@graphprotocol/graph-ts'
import { MutantAxApes } from '../../generated/MutantAxApes/MutantAxApes'

export function fetchName(): string {
  let contract = MutantAxApes.bind(dataSource.address())

  let nameResult = contract.try_name()
  if (!nameResult.reverted) {
    return nameResult.value
  }

  return 'unknown'
}

export function fetchSymbol(): string {
  let contract = MutantAxApes.bind(dataSource.address())

  let symbolResult = contract.try_symbol()
  if (!symbolResult.reverted) {
    return symbolResult.value
  }

  return 'unknown'
}

export function fetchTokenUri(tokenID: BigInt): string | null {
  let contract = MutantAxApes.bind(dataSource.address())

  let uriResult = contract.try_tokenURI(tokenID)
  if (!uriResult.reverted) {
    return uriResult.value
  }

  return null
}

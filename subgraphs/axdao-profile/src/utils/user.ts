/* eslint-disable prefer-const */
import { User } from '../../generated/schema'
import { constants } from '@amxx/graphprotocol-utils'

export function fetchUser(address: string): User {
  let user = User.load(address)

  if (user === null) {
    user = new User(address)
    user.isActive = true
    user.createdAt = constants.BIGINT_ZERO
    user.updatedAt = constants.BIGINT_ZERO
    user.block = constants.BIGINT_ZERO
    user.username = ''
    user.totalPoints = constants.BIGINT_ZERO
    user.save()
  }
  return user
}

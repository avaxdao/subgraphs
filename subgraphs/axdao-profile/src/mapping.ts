/* eslint-disable prefer-const */
import { constants, transactions } from '@amxx/graphprotocol-utils'
import {
  UserNew,
  UserPause,
  UserPointIncrease,
  UserPointDecrease,
  UserPointIncreaseMultiple,
  UserPointDecreaseMultiple,
  UserReactivate,
} from '../generated/Profile/Profile'
import { fetchUser } from './utils/user'
import { fetchPoints } from './utils/points'

/**
 * USER
 */
export function handleUserNew(event: UserNew): void {
  let user = fetchUser(event.params.userAddress.toHex())
  user.isActive = true
  user.createdAt = event.block.timestamp
  user.updatedAt = event.block.timestamp
  user.block = event.block.number
  user.username = event.params.username
  user.totalPoints = constants.BIGINT_ZERO
  user.save()
}

export function handleUserPause(event: UserPause): void {
  let user = fetchUser(event.params.userAddress.toHex())

  user.isActive = false
  user.updatedAt = event.block.timestamp
  user.save()
}

export function handleUserReactivate(event: UserReactivate): void {
  let user = fetchUser(event.params.userAddress.toHex())

  user.isActive = true
  user.updatedAt = event.block.timestamp
  user.save()
}

export function handleUserPointIncrease(event: UserPointIncrease): void {
  let user = fetchUser(event.params.userAddress.toHex())
  let point = fetchPoints(event.params.taskId.toString(), event.params.userAddress.toHex())

  point.user = event.params.userAddress.toHex()
  point.points = event.params.points
  point.taskId = event.params.taskId
  point.transaction = transactions.log(event).id
  point.timestamp = event.block.timestamp
  point.save()

  user.totalPoints = user.totalPoints.plus(point.points)
  user.save()
}

export function handleUserPointDecrease(event: UserPointDecrease): void {
  let user = fetchUser(event.params.userAddress.toHex())
  let point = fetchPoints(event.params.taskId.toString(), event.params.userAddress.toHex())

  point.user = event.params.userAddress.toHex()
  point.points = event.params.points
  point.taskId = event.params.taskId
  point.transaction = transactions.log(event).id
  point.timestamp = event.block.timestamp
  point.save()

  user.totalPoints = user.totalPoints.minus(point.points)
  user.save()
}

export function handleUserPointIncreaseMultiple(event: UserPointIncreaseMultiple): void {
  let taskId = event.params.taskId.toString()
  let count = event.params.userAddresses.length

  for (let i = 0; i < count; i++) {
    let user = fetchUser(event.params.userAddresses[i].toHex())
    let point = fetchPoints(taskId, user.id)
    point.user = user.id

    point.points = event.params.points
    point.taskId = event.params.taskId
    point.transaction = transactions.log(event).id
    point.timestamp = event.block.timestamp
    point.save()

    user.totalPoints = user.totalPoints.plus(point.points)
    user.save()
  }
}

export function handleUserPointDecreaseMultiple(event: UserPointDecreaseMultiple): void {
  let taskId = event.params.taskId.toString()
  let count = event.params.userAddresses.length

  for (let i = 0; i < count; i++) {
    let user = fetchUser(event.params.userAddresses[i].toHex())
    let point = fetchPoints(taskId, user.id)
    point.user = user.id

    point.points = event.params.points
    point.taskId = event.params.taskId
    point.transaction = transactions.log(event).id
    point.timestamp = event.block.timestamp
    point.save()

    user.totalPoints = user.totalPoints.minus(point.points)
    user.save()
  }
}

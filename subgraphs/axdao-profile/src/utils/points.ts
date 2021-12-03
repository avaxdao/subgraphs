/* eslint-disable prefer-const */
import { Point } from '../../generated/schema'

export function fetchPoints(taskId: string, userAddress: string): Point {
  let id = userAddress.concat('-').concat(taskId)

  let point = new Point(id)
  point.save()

  return point
}

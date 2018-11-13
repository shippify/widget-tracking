/**
 * @file utils.js
 * @description Utility functions
 *
 */

import { DeliveryStatus } from './constants.js';


/**
 *
 */
export const getEventIcon = (deliveryStatus, totalSteps) => {
  switch (deliveryStatus) {
    case DeliveryStatus.draft:
    case DeliveryStatus.pendingToReview:
    case DeliveryStatus.processing:
    case DeliveryStatus.scheduled:
    case DeliveryStatus.broadcasting:
    case DeliveryStatus.assigned:
    case DeliveryStatus.holdByCourier:
    case DeliveryStatus.confirmedToPickup:
    case DeliveryStatus.atPickup:
      return (
        (totalSteps > 1) ?
        "https://cdn.shippify.co/icons/icon-draft-green.svg" :
        "https://cdn.shippify.co/icons/icon-draft-blue.svg"
      )
    case DeliveryStatus.onDelivery:
    case DeliveryStatus.goingToDropoff:
    case DeliveryStatus.atDropoff:
    case DeliveryStatus.droppedOff:
      if (totalSteps === 2) {
        return "https://cdn.shippify.co/icons/icon-draft-blue.svg"
      }
      if (totalSteps === 3) {
        return "https://cdn.shippify.co/icons/icon-draft-red.svg"
      }
      break;
    case DeliveryStatus.completed:
      return "https://cdn.shippify.co/icons/icon-draft-green.svg"
    case DeliveryStatus.notPickedUp:
    case DeliveryStatus.canceled:
    case DeliveryStatus.returning:
    case DeliveryStatus.returned:
      return "https://cdn.shippify.co/icons/icon-draft-red.svg"
    default:
    break
  }
}

/**
 *
 */
export const getEventLabel = (deliveryStatus, totalSteps, attempt) => {
  switch (deliveryStatus) {
    case DeliveryStatus.draft:
    case DeliveryStatus.pendingToReview:
    case DeliveryStatus.processing:
    case DeliveryStatus.scheduled:
    case DeliveryStatus.broadcasting:
    case DeliveryStatus.assigned:
    case DeliveryStatus.holdByCourier:
    case DeliveryStatus.confirmedToPickup:
    case DeliveryStatus.atPickup:
      return (
        (totalSteps > 1) ?
        "Picked up" :
        "Pickup scheduled"
      )
    case DeliveryStatus.onDelivery:
      return (
        (totalSteps > 2) ?
        "Nobody authorized to receive the package was found" :
        (attempt > 1) ? "*#*º attempt: *TEXT*".replace("*#*", attempt) : "On delivery"
      )
    case DeliveryStatus.goingToDropoff:
      return (
        (totalSteps > 2) ?
        "Nobody authorized to receive the package was found" :
          (attempt > 1) ?
          "*#*º attempt: *TEXT*"
          .replace("*#*", attempt)
          .replace("*TEXT*", "On the way to your address") :
          "On the way to your address"
      )
    case DeliveryStatus.atDropoff:
      return (
        (totalSteps > 2) ?
        "Nobody authorized to receive the package was found" :
          (attempt > 1) ?
          "*#*º attempt: *TEXT*"
          .replace("*#*", attempt)
          .replace("*TEXT*", "Shipper has arrived") :
          "Shipper has arrived"
      )
    case DeliveryStatus.droppedOff:
      return (
        (totalSteps > 2) ?
        "Nobody authorized to receive the package was found" :
          (attempt > 1) ?
          "*#*º attempt: *TEXT*"
          .replace("*#*", attempt)
          .replace("*TEXT*", "Waiting for proof of delivery") :
          "Waiting for proof of delivery"
      )
    case DeliveryStatus.completed:
      return (attempt > 1) ?
      "*#*º attempt: *TEXT*"
      .replace("*#*", attempt)
      .replace("*TEXT*", "Delivered") :
      "Delivered"
    case DeliveryStatus.notPickedUp:
    case DeliveryStatus.canceled:
      return (attempt > 1) ?
      "*#*º attempt: *TEXT*"
      .replace("*#*", attempt)
      .replace("*TEXT*", "Canceled") :
      "Canceled"
    case DeliveryStatus.returning:
    case DeliveryStatus.returned:
      return (attempt > 1) ?
      "*#*º attempt: *TEXT*"
      .replace("*#*", attempt)
      .replace("*TEXT*", "Returned") :
      "Returned"
    default:
    break;
  }
}

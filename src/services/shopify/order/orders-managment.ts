import { errors } from '@strapi/utils'
import {Account} from "../../../../types/account";
import {ShopifyApiAccessOptions} from "../shopifyApi/types";
import {getFulfillmentRequestedOrders} from "../shopify";
import {
  getShopifyOrdersFromIdList, mapShopifyOrdersToEntity, createOrUpdateOrders
} from "../../../utils/order/orders-sync";
import {findOrdersFromListByOrderId} from "../../../db/db-order";
import { Strapi } from "@strapi/types";
import {OrderMapToEntityData} from "../../../utils/order/orders-sync";

const { ValidationError } = errors

export async function syncShopifyOrders(
 /* @ts-ignore*/
  strapi: Strapi,
  account: Account,
  shopNamePrefix: string,
  shopifyApiAccessOptions: ShopifyApiAccessOptions,
) {
  try {
    const fulfillmentRequestedOrders = await getFulfillmentRequestedOrders(shopifyApiAccessOptions)

    if (!fulfillmentRequestedOrders.length) {
      throw new ValidationError(`No assigned orders.`)
    }

    const fulfillmentRequestedOrdersId = fulfillmentRequestedOrders.map(order => order.order_id)

    const existingOrders = await findOrdersFromListByOrderId(strapi, fulfillmentRequestedOrdersId)

    const declinedExistingOrders = existingOrders.filter(order => order.shipping_status === "Declined")

    const newFulfillmentRequestedOrders = fulfillmentRequestedOrders.filter(order => !existingOrders.find(existingOrder => order.order_id === +existingOrder.order_id))

    if (!newFulfillmentRequestedOrders.length && !declinedExistingOrders.length) {
      throw new ValidationError(`No assigned orders`)
    }

    const ordersToUpdateOrCreateData: OrderMapToEntityData = {}

    for (const order of newFulfillmentRequestedOrders) {
      ordersToUpdateOrCreateData[order.order_id] = {
        fulfilmentOrderId: order.id,
        action: 'create'
      }
    }

    for (const order of declinedExistingOrders) {
      ordersToUpdateOrCreateData[order.order_id] = {
        id: order.id,
        fulfilmentOrderId: order.order_fulfillment_id,
        action: 'update',
      }
    }

    const newShopifyOrders = await getShopifyOrdersFromIdList(Object.keys(ordersToUpdateOrCreateData), shopifyApiAccessOptions)

    const ordersEntityData = mapShopifyOrdersToEntity(newShopifyOrders, ordersToUpdateOrCreateData, account, shopNamePrefix)

    const createdOrUpdatedOrders = await createOrUpdateOrders(strapi, ordersEntityData)

    return createdOrUpdatedOrders.length
  } catch (e) {
    console.log(e)
  }

}


import { errors } from '@strapi/utils'
import {Account} from "../../../../types/account";
import {ShopifyApiAccessOptions} from "../shopifyApi/types";
import {getFulfillmentRequestedOrders} from "../shopify";
import {
  getShopifyOrdersFromIdList, mapShopifyOrdersToEntity, createOrdersFromList
} from "../../../utils/order/orders-sync";
import {findOrdersFromListByOrderId} from "../../../db/db-order";
import { Strapi } from "@strapi/types";

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

    const newFulfillmentRequestedOrders = fulfillmentRequestedOrders.filter(order => !existingOrders.find(existingOrder => order.order_id === +existingOrder.order_id))

    if (!newFulfillmentRequestedOrders.length) {
      throw new ValidationError(`No assigned orders`)
    }

    const newFulfillmentRequestedOrdersId = newFulfillmentRequestedOrders.map(order => order.order_id)

    /*const newFulfillmentRequestedOrdersData = newFulfillmentRequestedOrders.map(order => {
    return {
      id: order.order_id,
      fulfilment_id: order.id
    }
     })*/

    const newShopifyOrders = await getShopifyOrdersFromIdList(newFulfillmentRequestedOrdersId, shopifyApiAccessOptions)

    const ordersEntity = mapShopifyOrdersToEntity(newShopifyOrders, account, shopNamePrefix)

    const newOrders = await createOrdersFromList(strapi, ordersEntity)

    return newOrders.map(order => order.id)
  } catch (e) {
    console.log(e)
  }

}


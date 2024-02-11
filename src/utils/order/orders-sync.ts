import {ShopifyFulfillmentOrder, ShopifyOrder, ShopifyProductVariant} from "../../services/shopify/types";
import {getOrderById, getProductByVariantId} from "../../services/shopify/shopify";
import {ShopifyApiAccessOptions} from "../../services/shopify/shopifyApi/types";
import {Order} from "../../../types/order";
import {Account} from "../../../types/account";
import {createOrder, updateOrder} from "../../db/db-order";

export interface OrdersEntityData {
  id?: number,
  action: OrderMapToEntityAction,
  data: Omit<Order, 'id'>
}

export type OrderMapToEntityAction = 'update' | 'create'

export interface OrderMapToEntityData {
  [key: number]: {
    fulfilmentOrderId: number,
    action: OrderMapToEntityAction,
    id?: number
  }
}

export const filterUniqueProductIdFromOrderList = (orders: ShopifyFulfillmentOrder[]): number[] => {
  const uniqueProducts: Set<number> = new Set()

  orders.forEach(order => {
    order.line_items.forEach(item => {
      uniqueProducts.add(item.variant_id)
    })
  })

  return [...uniqueProducts]
}

export const getShopifyProducts = async (productsIdList: number[], shopifyApiAccessOptions: ShopifyApiAccessOptions) => {
  const products: ShopifyProductVariant[] = []

  for (const id of productsIdList) {
    const product = await getProductByVariantId(shopifyApiAccessOptions, id)
    products.push(product)
  }

  return products
}

export const getShopifyOrdersFromIdList = async (ordersIdList: string[], shopifyApiAccessOptions: ShopifyApiAccessOptions)=> {
  const orders: ShopifyOrder[] = []

  for (const id of ordersIdList) {
    const order = await getOrderById(shopifyApiAccessOptions, +id)
    orders.push(order)
  }

  return orders
}

export const mapShopifyOrdersToEntity = (shopifyOrders: ShopifyOrder[], orderMapToEntityData: OrderMapToEntityData, account: Account, shopNamePrefix: string)
  : OrdersEntityData[] => {
  return shopifyOrders.map(shopifyOrder => {
    return  {
      id: orderMapToEntityData[shopifyOrder.id].id,
      action: orderMapToEntityData[shopifyOrder.id].action,
      data: {
        order_number: `${shopNamePrefix}_${shopifyOrder.order_number}`,
        order_id: (shopifyOrder.id).toString(),
        order_fulfillment_id: orderMapToEntityData[shopifyOrder.id].fulfilmentOrderId.toString(),
        shipping_status: "Pending",
        account,
        ShippingAddress: {
          address1: shopifyOrder?.shipping_address?.address1,
          address2: shopifyOrder?.shipping_address?.address2,
          city: shopifyOrder?.shipping_address?.city,
          state: shopifyOrder?.shipping_address?.province_code,
          zip: shopifyOrder?.shipping_address?.zip,
          country: shopifyOrder?.shipping_address?.country,
          name: shopifyOrder?.shipping_address?.name,
          company: shopifyOrder?.shipping_address?.company,
          email: shopifyOrder?.email,
          phone: shopifyOrder?.phone
        },
        Product: shopifyOrder?.line_items.map(product => {
          return {
            name: product.name,
            quantity: product.quantity,
            weight: +(product.grams * 0.00220462).toFixed(2)
          }
        })
      }
    }
  })
}

export const createOrUpdateOrders = async (
  /*@ts-ignore*/
  strapi: Strapi,
  data: OrdersEntityData[]
) => {
  const result: Order[] = []

  for (const item of data) {
    if (item.action === 'create') {
      const createdOrder = await createOrder(strapi, item.data)
        .catch(e => {
          console.log(e)
        })

      if (createdOrder) {
        result.push(createdOrder)
      }
    } else {
      const updatedOrder = await updateOrder(strapi, item.id, item.data).catch(e => {
        console.log(e)
      })

      if (updatedOrder) {
        result.push(updatedOrder)
      }

    }
  }

  return result
}


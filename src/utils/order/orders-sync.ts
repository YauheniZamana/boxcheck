import {ShopifyFulfillmentOrder, ShopifyOrder, ShopifyProductVariant} from "../../services/shopify/types";
import {getOrderById, getProductByVariantId} from "../../services/shopify/shopify";
import {ShopifyApiAccessOptions} from "../../services/shopify/shopifyApi/types";
import {Order} from "../../../types/order";
import {Account} from "../../../types/account";
import {createOrder} from "../../db/db-order";
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

export const getShopifyOrdersFromIdList = async (ordersIdList: number[], shopifyApiAccessOptions: ShopifyApiAccessOptions)=> {
  const orders: ShopifyOrder[] = []

  for (const id of ordersIdList) {
    const order = await getOrderById(shopifyApiAccessOptions, id)
    orders.push(order)
  }

  return orders
}

export const mapShopifyOrdersToEntity = (shopifyOrders: ShopifyOrder[], account: Account, shopNamePrefix: string): Omit<Order, 'id'>[] => {
 return shopifyOrders.map(shopifyOrder => {
    return {
      order_number: `${shopNamePrefix}_${shopifyOrder.order_number}`,
      order_id: (shopifyOrder.id).toString(),
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
  })
}

export const createOrdersFromList = async (
  /*@ts-ignore*/
  strapi: Strapi.Strapi,
  data: Omit<Order, 'id'>[]
) => {
  const result: Order[] = []

  for (const item of data) {
    const order = await createOrder(strapi, item)
      .catch(e => {
        console.log(e)
      })

    if (order) {
      result.push(order)
    }
  }

  return result
}

import { errors } from '@strapi/utils'
import {CreateShopifyFulfillmentServiceDto} from "./shopifyDto";
import { ShopifyApiAccessOptions, ShopifyApiAssignedFulfillmentOrderStatus } from './shopifyApi/types'
import {ShopifyFulfillmentService, ShopifyFulfillmentOrder, ShopifyProductVariant, ShopifyOrder} from "./types";
import {shopifyApi} from "./shopifyApi";

const { ApplicationError } = errors

export async function createFulfillmentService(
  data: Record<'fulfillment_service', CreateShopifyFulfillmentServiceDto>,
  options: ShopifyApiAccessOptions,
): Promise<ShopifyFulfillmentService> {
  const res = await shopifyApi<ShopifyFulfillmentService>('post', {
    data,
    targetURL: 'fulfillment_services.json',
    ...options,
  }).catch((error) => {
    console.log("ERROR RESPONSE", error.response.data)
    throw new ApplicationError(error.message, 'Error while createFulfillmentService call')
  })

  return res.data
}

export async function deleteFulfillmentService(serviceId: number, options: ShopifyApiAccessOptions): Promise<void> {
  await shopifyApi('delete', {
    targetURL: `fulfillment_services/${serviceId}.json`,
    ...options,
  }).catch((error) => {
    throw new ApplicationError(error.message, 'Error while deleteFulfillmentService call')
  })
}

export async function getShopifyOrders(
  options: ShopifyApiAccessOptions,
): Promise<ShopifyFulfillmentOrder[]> {
  const response = await shopifyApi<Record<any, any[]>>('get', {
    targetURL: `orders.json?status=any`,
    ...options,
  }).catch((error) => {
    throw new ApplicationError(error.message, 'Error while getAssignedShopifyFulfillmentOrders call')
  })

  /*@ts-ignore*/
  return response.data
}


export async function getFulfillmentRequestedOrders(
  options: ShopifyApiAccessOptions,
): Promise<ShopifyFulfillmentOrder[]> {
  const response = await shopifyApi<Record<'fulfillment_orders', ShopifyFulfillmentOrder[]>>('get', {
    targetURL: `assigned_fulfillment_orders.json?assignment_status=fulfillment_requested`,
    ...options,
  }).catch((error) => {
    throw new ApplicationError(error.message, 'Error while getAssignedShopifyFulfillmentOrders call')
  })

  return response.data?.fulfillment_orders ?? []
}

export async function getProductByVariantId(
  options: ShopifyApiAccessOptions,
  id: number
): Promise<ShopifyProductVariant> {
  const response = await shopifyApi<Record<'variant', ShopifyProductVariant>>('get', {
    targetURL: `variants/${id}.json`,
    ...options,
  }).catch((error) => {
    throw new ApplicationError(error.message, 'Error while getProductByVariantId call')
  })

  return response.data?.variant
}

export async function getOrderById(
  options: ShopifyApiAccessOptions,
  id: number
): Promise<ShopifyOrder> {
  const response = await shopifyApi<Record<'order', ShopifyOrder>>('get', {
    targetURL: `orders/${id}.json`,
    ...options,
  }).catch((error) => {
    throw new ApplicationError(error.message, 'Error while getOrderById call')
  })

  return response.data?.order
}

export async function rejectOrderFulfilment(
  options: ShopifyApiAccessOptions,
  id: string
): Promise<object> {
  const response = await shopifyApi<Record<'order', ShopifyOrder>>('post', {
    targetURL: `fulfillment_orders/${id}/fulfillment_request/reject.json`,
    ...options,
  }).catch((error) => {
    throw new ApplicationError(error.message, 'Error while rejectOrderFulfilment call')
  })

  return response
}

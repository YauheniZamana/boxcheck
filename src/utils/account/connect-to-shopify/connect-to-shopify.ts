import { errors } from '@strapi/utils'
import {CreateShopifyFulfillmentServiceDto} from "../../../services/shopify/shopifyDto";
import {createFulfillmentService, deleteFulfillmentService} from "../../../services/shopify/shopify";

const { ValidationError } = errors
const BOXCHECK_SHOPIFY_HOST = process.env.BOXCHECK_SHOPIFY_HOST
export async function shopifyAccountConnector(
  shopifyConnectComponentData: any
) {
  const shouldConnectToShopify = shopifyConnectComponentData.ConnectToShopify
  const shopifyAccessToken = shopifyConnectComponentData.ShopifyAccessToken
  const shopifyBaseUrl = shopifyConnectComponentData.ShopifyUrl

  if (!shopifyAccessToken || !shopifyBaseUrl) {
    throw new ValidationError('Shopify access token and base URL are required.')
  }

  const alreadyConnectedToShopify =
    shopifyConnectComponentData.FulfillmentServiceId && shopifyConnectComponentData.FulfillmentServiceLocationId

  const shopifyApiOptions = {
    accessToken: shopifyAccessToken,
    baseURL: shopifyBaseUrl,
  }

  if (shouldConnectToShopify && !alreadyConnectedToShopify) {
    if (!BOXCHECK_SHOPIFY_HOST) {
      throw new ValidationError(`BOXCHECK_SHOPIFY_HOST env doesn't exist.`)
    }

    const createFulfillmentServiceData = new CreateShopifyFulfillmentServiceDto(
      shopifyConnectComponentData.FulfillmentServiceName ?? 'BOXCHECK-SHOPIFY-TEST',
      `${BOXCHECK_SHOPIFY_HOST}/api/admin/${shopifyConnectComponentData.ShopNamePrefix}`,
    )

    const fulfillmentServiceData = await createFulfillmentService(
      {
        fulfillment_service: createFulfillmentServiceData,
      },
      shopifyApiOptions,
    )

    return {
      FulfillmentServiceId: `${fulfillmentServiceData.fulfillment_service.id}`,
      FulfillmentServiceLocationId: `${fulfillmentServiceData.fulfillment_service.location_id}`,
      FulfillmentServiceName: createFulfillmentServiceData.name,
    }
  }

  if (!shouldConnectToShopify && alreadyConnectedToShopify) {
    if (!shopifyConnectComponentData.FulfillmentServiceId) {
      throw new ValidationError('FulfillmentServiceId is undefined.')
    }

    if (!shopifyConnectComponentData.FulfillmentServiceLocationId) {
      throw new ValidationError('FulfillmentServiceLocationId is undefined.')
    }

    await deleteFulfillmentService(+shopifyConnectComponentData.FulfillmentServiceId, shopifyApiOptions)

    return {
      FulfillmentServiceId: null,
      FulfillmentServiceLocationId: null,
      FulfillmentServiceName: null,
    }
  }

  return {
    FulfillmentServiceId: shopifyConnectComponentData.FulfillmentServiceId,
    FulfillmentServiceLocationId: shopifyConnectComponentData.FulfillmentServiceLocationId,
    FulfillmentServiceName: shopifyConnectComponentData.FulfillmentServiceName,
  }
}

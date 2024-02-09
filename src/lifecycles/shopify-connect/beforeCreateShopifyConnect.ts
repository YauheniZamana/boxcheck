import { errors } from '@strapi/utils'
import {shopifyAccountConnector} from "../../utils/account/connect-to-shopify/connect-to-shopify";
import {findAccountShopifyConnectComponentById} from "../../db/db-account";

export async function beforeCreateShopifyConnect(event: any) {
  const componentData = event.params.data

  if (componentData.id) {
    const prevComponentData = await findAccountShopifyConnectComponentById(strapi, componentData.id)

    const prevShopNamePrefix = prevComponentData?.ShopNamePrefix

    if (!prevShopNamePrefix) {
      throw new errors.ValidationError(`Can't find ShopNamePrefix.`)
    }

    if (prevShopNamePrefix && prevShopNamePrefix !== componentData.ShopNamePrefix) {
      throw new errors.ValidationError(`ShopNamePrefix value must be set once.`)
    }
  }

  const { FulfillmentServiceId, FulfillmentServiceLocationId, FulfillmentServiceName } =
    await shopifyAccountConnector(componentData).catch(error => {
      console.error('❌ Error while shopify connect function call', error)

      throw error
    })

  event.params.data = {
    ...event.params.data,
    // @ts-ignore
    FulfillmentServiceId,
    // @ts-ignore
    FulfillmentServiceLocationId,
    // @ts-ignore
    FulfillmentServiceName,
  }
}

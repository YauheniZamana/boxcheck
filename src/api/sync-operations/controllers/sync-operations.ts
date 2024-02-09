import {SHOPIFY_NOTIFICATION_REQ_TYPE} from "../../../const/shopify";
import {findAccountByShopifyShopNamePrefix} from "../../../db/db-account";
import {syncShopifyOrders} from "../../../services/shopify/order/orders-managment";
import {manageShipments} from "../../../services/boxcheck/shipment/shipments-managment";
import {Strapi} from "@strapi/types";

export default ({ strapi }: { strapi: Strapi }) => ({
  getNotificationFromShopify: async (ctx: any) => {
    try {
      const { shopNamePrefix } = ctx.params

      const account = await findAccountByShopifyShopNamePrefix(strapi, shopNamePrefix)

      const isFulfillmentRequest = ctx.request.body.kind ===  SHOPIFY_NOTIFICATION_REQ_TYPE.FULFILLMENT_REQUEST

      const shopifyApiAccessOptions = {
        accessToken: account.ShopifyConnect.ShopifyAccessToken,
        baseURL: account.ShopifyConnect.ShopifyUrl,
      }

      if (isFulfillmentRequest) {
        /*@ts-ignore*/
        const syncShopifyOrdersResult = await syncShopifyOrders(strapi, account, shopNamePrefix, shopifyApiAccessOptions)

        if (syncShopifyOrdersResult) {
          const result = await manageShipments(strapi, syncShopifyOrdersResult)
          console.log("RESULT" ,result)
        }
      }

    } catch(e) {
      console.log(e)
    }
  }
})

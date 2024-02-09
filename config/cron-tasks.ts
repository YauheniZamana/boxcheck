import {findAccountsWithShopifyConnection} from "../src/db/db-account";
import {getShopifyOrders} from "../src/services/shopify/shopify";

/*export default {
  syncOrders: {
    task: async ({ strapi }) => {
      try {
        const accounts = await findAccountsWithShopifyConnection(strapi)

        for (const account of accounts) {
          const shopifyApiAccessOptions = {
            accessToken: account.ShopifyConnect.ShopifyAccessToken,
            baseURL: account.ShopifyConnect.ShopifyUrl,
          }

          /!*@ts-ignore*!/
          const orders = await getShopifyOrders(shopifyApiAccessOptions)
        }
      } catch (e) {
        console.log(e)
      }
    },
    options: {
      rule: '0 * * * * *', // every minute
    }
  }
}*/

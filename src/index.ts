import {beforeCreateShopifyConnect} from "./lifecycles/shopify-connect/beforeCreateShopifyConnect";
import {ACCOUNT_SHOPIFY_CONNECT_UID} from "./const/strapi-uid";

export default {
  /// eslint-disable-next-line @typescript-eslint/no-empty-function
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    const metadata = strapi.db.metadata

    metadata?.set(ACCOUNT_SHOPIFY_CONNECT_UID, {
      ...metadata.get(ACCOUNT_SHOPIFY_CONNECT_UID),
      lifecycles: {
        beforeCreate: beforeCreateShopifyConnect,

        beforeUpdate: beforeCreateShopifyConnect,
      },
    })
  },
};

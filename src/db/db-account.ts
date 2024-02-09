import {ACCOUNT_SHOPIFY_CONNECT_UID, ACCOUNT_UID} from "../const/strapi-uid";
import { errors } from '@strapi/utils'
import {Account} from "../../types/account";

export async function findAccountsWithShopifyConnection(
  //@ts-ignore
  strapi: Strapi.Strapi
): Promise<Account[]> {
  const result = await strapi.entityService.findMany(ACCOUNT_UID, {
    populate: ['ShopifyConnect'],
    filters: {
      ShopifyConnect: {
        ConnectToShopify: true,
      },
    },
  })

  return result
}

export async function findAccountShopifyConnectComponentById(
  //@ts-ignore
  strapi: Strapi.Strapi,
  id: number,
): Promise<Account['ShopifyConnect'] | null> {
  return strapi.entityService.findOne(ACCOUNT_SHOPIFY_CONNECT_UID, id)
}

export async function findAccountByShopifyShopNamePrefix(
  //@ts-ignore
  strapi: Strapi.Strapi,
  shopNamePrefix: string,
): Promise<Account> {
  const results = await strapi.entityService.findMany(ACCOUNT_UID, {
    populate: ['ShopifyConnect'],
    filters: {
      ShopifyConnect: {
        ShopNamePrefix: shopNamePrefix,
      },
    },
  })

  const account = results[0]

  if (!account) {
    throw new errors.ValidationError(`No connected to Shopify accounts with shop prefix ${shopNamePrefix}`)
  }

  return account
}

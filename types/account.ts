import {GetAttributesValues, WithID} from "../general-schemas";
import {AddressInfo} from "./common";

export interface Account {
  id: number
  Name: string
  ShopifyConnect: GetAttributesValues<'account.shopify-connect'> & WithID,
  AddressInfo: AddressInfo
}

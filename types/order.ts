import {Account} from "./account";
import {AddressInfo} from "./common";

export interface Order {
  id: number,
  order_id: string,
  /*order_fulfillment_id: string,*/
  order_number: string
  account: Account,
  ShippingAddress: AddressInfo,
  Product: OrderProduct[],
}

export interface OrderProduct {
  name: string,
  quantity: number,
  weight: number
}

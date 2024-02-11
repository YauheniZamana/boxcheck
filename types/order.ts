import {Account} from "./account";
import {AddressInfo} from "./common";

export type OrderShippingStatus = 'Pending' | 'Declined' | 'Created'

export interface OrderProduct {
  name: string,
  quantity: number,
  weight: number
}

export interface Order {
  id: number,
  order_id: string,
  order_fulfillment_id: string,
  order_number: string
  account: Account,
  ShippingAddress: AddressInfo,
  Product: OrderProduct[],
  shipping_status: OrderShippingStatus
}

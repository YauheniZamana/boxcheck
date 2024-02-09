export interface ShopifyApiAccessOptions {
  baseURL: string
  accessToken: string
}

export interface ShopifyApiOptions extends ShopifyApiAccessOptions {
  targetURL: string
  data?: object
}

export type ShopifyApiAssignedFulfillmentOrderStatus =
  | 'fulfillment_requested'
  | 'fulfillment_accepted'
  | 'cancellation_requested'
  | 'fulfillment_unsubmitted'
  | ''

export interface ShopifyFulfillmentService {
  fulfillment_service: {
    id: number
    name: string
    email: null | string
    service_name: string
    fulfillment_orders_opt_in: boolean
    include_pending_stock: boolean
    provider_id: null | number
    location_id: number
    callback_url: string
    tracking_support: boolean
    inventory_management: boolean
    permits_sku_sharing: boolean
  }
}

export interface ShopifyFulfillmentOrderDestination {
  address1: string
  address2: string | null
  city: string
  company: null
  country: string
  email: string
  first_name: string
  last_name: string
  phone: string | null
  province: string | null
  zip: string | null
}

export interface ShopifyFulfillmentOrderLineItem {
  id: number
  shop_id: number
  fulfillment_order_id: number
  quantity: 1
  line_item_id: number
  inventory_item_id: number
  variant_id: number
}

export interface ShopifyFulfillmentOrderAssignedLocation {
  address1: string | null
  address2: string | null
  city: string | null
  country_code: string
  location_id: number
  name: string
  phone: string | null
  province: string | null
  zip: string | null
}

export interface ShopifyFulfillmentOrderOutgoingRequests {
  sent_at: string
}


export interface ShopifyFulfillmentOrder {
  id: number
  order_id: number
  assigned_location_id: number
  request_status: string
  status: string
  destination: ShopifyFulfillmentOrderDestination
  line_items: ShopifyFulfillmentOrderLineItem[]
  assigned_location: ShopifyFulfillmentOrderAssignedLocation,
  outgoing_requests: ShopifyFulfillmentOrderOutgoingRequests,
  fulfill_at: string
}

export interface ShopifyProductVariant {
  id: number,
  sku: string,
  weight: number | null,
}

export interface ShopifyOrderShipmentAddress {
  address1: string,
  address2: string,
  city: string,
  province_code: string,
  zip: string,
  country: string,
  name: string,
  company: string,
}

export interface ShopifyOrderLineItem {
  id: number,
  product_id: number,
  name: string,
  grams: number,
  quantity: number
}

export interface ShopifyOrder {
  id: number,
  order_number: number,
  line_items: ShopifyOrderLineItem[],
  email: string,
  phone: string,
  shipping_address: ShopifyOrderShipmentAddress
}

export class CreateShopifyFulfillmentServiceDto {
  tracking_support: boolean
  permits_sku_sharing: boolean
  requires_shipping_method: boolean
  fulfillment_orders_opt_in: boolean
  inventory_management: boolean
  format: 'json'
  constructor(readonly name: string, readonly callback_url: string) {
    this.format = 'json'
    this.tracking_support = true
    this.permits_sku_sharing = true
    this.inventory_management = false
    this.requires_shipping_method = true
    this.fulfillment_orders_opt_in = true
  }
}

export class CreateFulfillmentRejectDto {
  constructor(
    readonly message: string,
    readonly Reason: string,
    readonly line_items: { fulfillment_order_line_item_id: number; message: string }[],
  ) {}
}

export class CreateFulfillmentAcceptDto {
  constructor(readonly message: string = '') {}
}

export class CreateFulfillmentForOrderDto {
  line_items_by_fulfillment_order: {
    fulfillment_order_id: number
    notifyCustomer: boolean
  }[] = []
  tracking_info: {
    number: string
    company: string
    url?: string
  } | null = null
  constructor(
    fulfillmentOrderId: number,
    notifyCustomer = false,
    trackingInfo?: CreateFulfillmentForOrderDto['tracking_info'],
  ) {
    this.line_items_by_fulfillment_order.push({
      fulfillment_order_id: fulfillmentOrderId,
      notifyCustomer,
    })

    if (trackingInfo) {
      this.tracking_info = trackingInfo
    }
  }
}

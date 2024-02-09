export default {
  routes: [
    {
      method: 'POST',
      path: '/admin/:shopNamePrefix/fulfillment_order_notification',
      handler: 'sync-operations.getNotificationFromShopify',
      config: {
        policies: [],
        middlewares: [],
        auth: false,
      },
    },
  ],
}

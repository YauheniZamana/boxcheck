import type { Schema, Attribute } from '@strapi/strapi';

export interface AccountShopifyConnect extends Schema.Component {
  collectionName: 'components_account_shopify_connects';
  info: {
    displayName: 'ShopifyConnect';
    description: '';
  };
  attributes: {
    ShopifyUrl: Attribute.Text & Attribute.Required;
    ShopifyAccessToken: Attribute.Text & Attribute.Required;
    ShopNamePrefix: Attribute.String & Attribute.Required;
    ConnectToShopify: Attribute.Boolean;
    FulfillmentServiceId: Attribute.BigInteger;
    FulfillmentServiceName: Attribute.Text;
    FulfillmentServiceLocationId: Attribute.BigInteger;
  };
}

export interface OrderOrderProduct extends Schema.Component {
  collectionName: 'components_order_order_products';
  info: {
    displayName: 'OrderProduct';
    description: '';
  };
  attributes: {
    name: Attribute.String;
    quantity: Attribute.Integer;
    weight: Attribute.Integer;
  };
}

export interface SharedAdressInfo extends Schema.Component {
  collectionName: 'components_shared_adress_infos';
  info: {
    displayName: 'AddressInfo';
    description: '';
  };
  attributes: {
    address1: Attribute.String;
    address2: Attribute.String;
    city: Attribute.String;
    state: Attribute.String;
    zip: Attribute.String;
    country: Attribute.String;
    name: Attribute.String;
    company: Attribute.String;
    email: Attribute.String;
    phone: Attribute.String;
  };
}

export interface ShipmentShipmentData extends Schema.Component {
  collectionName: 'components_shipment_shipment_data';
  info: {
    displayName: 'ShipmentData';
  };
  attributes: {
    shipmentLabel: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'account.shopify-connect': AccountShopifyConnect;
      'order.order-product': OrderOrderProduct;
      'shared.adress-info': SharedAdressInfo;
      'shipment.shipment-data': ShipmentShipmentData;
    }
  }
}

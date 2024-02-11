import {Order, OrderShippingStatus} from "../../types/order";
import {ORDER_UID} from "../const/strapi-uid";

export async function findOrdersFromListByOrderId(
  //@ts-ignore
  strapi: Strapi.Strapi,
  orderIdsList: number[],
) : Promise<Order[]> {
  return strapi.entityService.findMany(ORDER_UID, {
    where: {
      order_id: {
        $in: orderIdsList
      },
    }
  })
}

export async function findOrdersFromListByShippingStatus(
  //@ts-ignore
  strapi: Strapi.Strapi,
  status: OrderShippingStatus
) : Promise<Order[]> {
  return strapi.entityService.findMany(ORDER_UID, {
    populate: ['Product', 'ShippingAddress'],
    where: {
      shipping_status: status
    }
  })
}

export async function createOrder(
  //@ts-ignore
  strapi: Strapi.Strapi,
  data: Omit<Order, 'id'>,
) : Promise<Order> {
  return strapi.entityService.create(ORDER_UID, {
    data
  })
}

export async function updateOrder(
  //@ts-ignore
  strapi: Strapi.Strapi,
  id: number,
  data: Omit<Order, 'id'>,
) : Promise<Order> {
  return strapi.entityService.update(ORDER_UID, id, {
    data
  })
}

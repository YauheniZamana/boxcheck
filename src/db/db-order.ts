import {Order} from "../../types/order";
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
      }
    }
  })
}

export async function findOrdersFromListById(
  //@ts-ignore
  strapi: Strapi.Strapi,
  idsList: number[],
) : Promise<Order[]> {
  return strapi.entityService.findMany(ORDER_UID, {
    populate: ['Product', 'ShippingAddress'],
    where: {
      id: {
        $in: idsList
      }
    }
  })
}

export async function createOrder(
  //@ts-ignore
  strapi: Strapi.Strapi,
  data: Omit<Order, 'id'>,
) : Promise<Order> {
  console.log("CREATE")

  return strapi.entityService.create(ORDER_UID, {
    data
  }).catch(e => {
    console.log("ERROR", e)
  })
}
